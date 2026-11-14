package rumbo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.web.HeaderBearerTokenResolver;
import org.springframework.security.web.SecurityFilterChain;

/**
 * The origin validates the identity token itself, as Cloudflare documents for Access: the token comes
 * in the Cf-Access-Jwt-Assertion header, its signature is checked against the published keys, and
 * issuer and audience must match. Without this check, anyone who reaches the origin directly
 * skips the edge.
 */
@Configuration
public class SecurityConfig {
    @Bean
    JwtDecoder accessTokens(@Value("${rumbo.access.certs}") String certs,
            @Value("${rumbo.access.issuer}") String issuer,
            @Value("${rumbo.access.audience}") String audience) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri(certs).jwsAlgorithm(SignatureAlgorithm.ES256).build();
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<Jwt>(
                JwtValidators.createDefaultWithIssuer(issuer),
                jwt -> jwt.getAudience() != null && jwt.getAudience().contains(audience)
                        ? OAuth2TokenValidatorResult.success()
                        : OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "audience is not " + audience, null))));
        return decoder;
    }

    @Bean
    SecurityFilterChain security(HttpSecurity http) throws Exception {
        return http.csrf(c -> c.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(a -> a.requestMatchers("/panel/**", "/panel").authenticated().anyRequest().permitAll())
                .oauth2ResourceServer(o -> o.bearerTokenResolver(new HeaderBearerTokenResolver("Cf-Access-Jwt-Assertion")).jwt(j -> {}))
                .build();
    }
}
