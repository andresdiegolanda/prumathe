package course.entra;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.*;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    JwtDecoder decoder(@Value("${AUTH_MODE:entra}") String mode,
            @Value("${TENANT_ID}") String tenant,
            @Value("${API_CLIENT_ID}") String audience,
            @Value("${SPA_CLIENT_ID}") String client) {
        // Fail on malformed configuration. Never choose an issuer from an untrusted token.
        UUID.fromString(tenant);
        UUID.fromString(audience);
        UUID.fromString(client);
        if (!List.of("fixture", "entra").contains(mode)) {
            throw new IllegalArgumentException("AUTH_MODE must be fixture or entra");
        }
        String issuer = mode.equals("fixture") ? "http://issuer:9000"
                : "https://login.microsoftonline.com/" + tenant + "/v2.0";
        NimbusJwtDecoder decoder = mode.equals("fixture")
                ? NimbusJwtDecoder.withJwkSetUri("http://issuer:9000/jwks").build()
                : NimbusJwtDecoder.withIssuerLocation(issuer).build();
        OAuth2TokenValidator<Jwt> application = jwt -> {
            boolean valid = jwt.getAudience().contains(audience)
                    && tenant.equals(jwt.getClaimAsString("tid"))
                    && "2.0".equals(jwt.getClaimAsString("ver"))
                    && client.equals(jwt.getClaimAsString("azp"))
                    && jwt.getExpiresAt() != null && jwt.getNotBefore() != null
                    && isUuid(jwt.getClaimAsString("oid"));
            return valid ? OAuth2TokenValidatorResult.success()
                    : OAuth2TokenValidatorResult.failure(
                        new OAuth2Error("invalid_token", "Token does not satisfy this API contract", null));
        };
        // Keep Spring's issuer and time validators when adding our own checks.
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefaultWithIssuer(issuer), application));
        return decoder;
    }

    private static boolean isUuid(String value) {
        try { return value != null && UUID.fromString(value).toString().equalsIgnoreCase(value); }
        catch (IllegalArgumentException ex) { return false; }
    }

    @Bean
    SecurityFilterChain security(HttpSecurity http) throws Exception {
        JwtGrantedAuthoritiesConverter scopes = new JwtGrantedAuthoritiesConverter();
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            var authorities = new ArrayList<>(scopes.convert(jwt));
            List<String> roles = jwt.getClaimAsStringList("roles");
            if (roles != null && roles.contains("Approver")) {
                authorities.add(new SimpleGrantedAuthority("ROLE_Approver"));
            }
            return authorities;
        });
        return http.cors(c -> c.configurationSource(cors()))
                // This API accepts Authorization headers only; it has no cookie login.
                .csrf(c -> c.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(a -> a.requestMatchers("/health", "/error").permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(o -> o.jwt(j -> j.jwtAuthenticationConverter(converter)))
                .build();
    }

    private CorsConfigurationSource cors() {
        var config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:18094"));
        config.setAllowedMethods(List.of("GET", "POST", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
