package rumbo;

import java.util.Map;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** The internal panel: it answers only to a request that carries a valid token. */
@RestController
public class PanelController {
    @GetMapping("/panel")
    Map<String, Object> panel(@AuthenticationPrincipal Jwt jwt) {
        return Json.of("panel", "Rumbo operations", "email", jwt.getClaimAsString("email"), "issuer", jwt.getIssuer().toString(), "audience", jwt.getAudience());
    }
}
