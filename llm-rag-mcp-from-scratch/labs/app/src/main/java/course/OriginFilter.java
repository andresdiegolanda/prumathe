package course;

import java.io.IOException;
import java.net.URI;
import java.util.Set;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Lesson 24: a Streamable HTTP server must validate the Origin header, so that a web page cannot
 * reach a local server through DNS rebinding. With the settings of the kit, Spring AI 2.0.1 does
 * not check it; this filter answers 403 to any Origin that is not this machine. A request without
 * Origin (a client that is not a browser) passes.
 */
@Component
@Profile("mcp & !stdio")
class OriginFilter extends OncePerRequestFilter {

    private static final Set<String> ALLOWED = Set.of("localhost", "127.0.0.1", "[::1]");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String origin = request.getHeader("Origin");
        if (origin != null && !allowed(origin)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            String shown = origin.replaceAll("[^A-Za-z0-9:/._\\-\\[\\]]", "?");
            response.getWriter().write("{\"jsonrpc\":\"2.0\",\"error\":{\"code\":-32000,\"message\":\"Origin not allowed: " + shown + "\"}}");
            return;
        }
        chain.doFilter(request, response);
    }

    static boolean allowed(String origin) {
        try {
            String host = URI.create(origin).getHost();
            return host != null && ALLOWED.contains(host);
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
