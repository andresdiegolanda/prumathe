package course.entra;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class Requests {
    private final JdbcTemplate db;
    private final String mode;
    public Requests(JdbcTemplate db, @Value("${AUTH_MODE:entra}") String mode) {
        this.db = db;
        this.mode = mode;
    }

    @GetMapping("/health")
    public Map<String, String> health() { return Map.of("status", "up", "authMode", mode); }

    // This context is transaction-local, so pooled connections cannot carry it to the next user.
    private void context(Jwt jwt, Authentication authentication) {
        boolean approver = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_Approver"));
        db.queryForObject("SELECT set_config('app.tenant', ?, true)", String.class, jwt.getClaimAsString("tid"));
        db.queryForObject("SELECT set_config('app.subject', ?, true)", String.class, jwt.getClaimAsString("oid"));
        db.queryForObject("SELECT set_config('app.approver', ?, true)", String.class, Boolean.toString(approver));
    }

    @GetMapping("/api/requests/{id}")
    @PreAuthorize("hasAuthority('SCOPE_Requests.Read')")
    @Transactional
    public Map<String, Object> read(@PathVariable long id, @AuthenticationPrincipal Jwt jwt,
            Authentication auth) {
        context(jwt, auth);
        // Endpoint policy: even approvers read only their own requests on this endpoint.
        List<Map<String, Object>> rows = db.queryForList(
                "SELECT id, description, status FROM purchase_request WHERE id = ? AND tenant_id = ? AND owner_oid = ?",
                id, UUID.fromString(jwt.getClaimAsString("tid")), UUID.fromString(jwt.getClaimAsString("oid")));
        if (rows.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return Map.of("request", rows.getFirst(), "decision", "scope + tenant + owner", "evidence", "Spring + PostgreSQL");
    }

    @PostMapping("/api/requests/{id}/approve")
    @PreAuthorize("hasAuthority('SCOPE_Requests.Approve') and hasAuthority('ROLE_Approver')")
    @Transactional
    public Map<String, Object> approve(@PathVariable long id, @AuthenticationPrincipal Jwt jwt,
            Authentication auth) {
        context(jwt, auth);
        // Authorize and mutate atomically. A separate check followed by UPDATE would race.
        int changed = db.update("UPDATE purchase_request SET status = 'APPROVED' "
                + "WHERE id = ? AND tenant_id = ? AND owner_oid <> ? AND status = 'PENDING'",
                id, UUID.fromString(jwt.getClaimAsString("tid")), UUID.fromString(jwt.getClaimAsString("oid")));
        if (changed != 1) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return Map.of("id", id, "status", "APPROVED", "decision", "scope + role + tenant + not owner + pending");
    }
}
