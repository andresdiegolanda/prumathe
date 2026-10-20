package course;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.context.annotation.Profile;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;

import jakarta.servlet.AsyncEvent;
import jakarta.servlet.AsyncListener;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.WriteListener;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;

/**
 * For the live viewer: every HTTP message the MCP server receives and sends, headers included,
 * as a line in the events volume. It runs before OriginFilter, so a 403 is recorded too. The
 * response is copied while it is written, not held: a stream of server-sent events still reaches
 * the client as it is produced.
 */
@Component
@Profile("mcp & !stdio")
@Order(Ordered.HIGHEST_PRECEDENCE)
class McpWireLog extends OncePerRequestFilter {

    private static final int MAX = 64 * 1024;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        long at = System.currentTimeMillis();
        ContentCachingRequestWrapper req = new ContentCachingRequestWrapper(request, MAX);
        Copy res = new Copy(response);
        try {
            chain.doFilter(req, res);
        } finally {
            res.flushWriter();
            if (req.isAsyncStarted()) {
                req.getAsyncContext().addListener(new AsyncListener() {
                    @Override
                    public void onComplete(AsyncEvent e) {
                        res.flushWriter();
                        record(at, req, res);
                    }

                    @Override
                    public void onTimeout(AsyncEvent e) {}

                    @Override
                    public void onError(AsyncEvent e) {}

                    @Override
                    public void onStartAsync(AsyncEvent e) {}
                });
            } else {
                record(at, req, res);
            }
        }
    }

    private static void record(long at, ContentCachingRequestWrapper req, Copy res) {
        Map<String, List<String>> in = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
        for (String name : Collections.list(req.getHeaderNames())) in.put(name, Collections.list(req.getHeaders(name)));
        Map<String, List<String>> out = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
        for (String name : res.getHeaderNames()) out.put(name, List.copyOf(res.getHeaders(name)));
        var line = Events.object().put("transport", "http").put("at", at).put("ms", System.currentTimeMillis() - at);
        var r = line.putObject("request").put("method", req.getMethod()).put("path", req.getRequestURI());
        r.set("headers", Events.headers(in));
        String body = new String(req.getContentAsByteArray(), StandardCharsets.UTF_8);
        if (!body.isEmpty()) r.put("body", Events.body(body));
        var s = line.putObject("response").put("status", res.getStatus());
        s.set("headers", Events.headers(out));
        String sent = res.copy();
        if (!sent.isEmpty()) s.put("body", sent);
        Events.serverLine(line);
    }

    /** The response, copied as it is written (up to 64 KB). */
    static final class Copy extends HttpServletResponseWrapper {
        private final ByteArrayOutputStream copy = new ByteArrayOutputStream();
        private ServletOutputStream stream;
        private PrintWriter writer;

        Copy(HttpServletResponse response) {
            super(response);
        }

        String copy() {
            synchronized (copy) {
                return copy.toString(StandardCharsets.UTF_8);
            }
        }

        /** What a filter wrote with getWriter and did not flush still goes to the client. */
        void flushWriter() {
            if (writer != null) writer.flush();
        }

        private void keep(byte[] b, int off, int len) {
            synchronized (copy) {
                int room = MAX - copy.size();
                if (room > 0) copy.write(b, off, Math.min(room, len));
            }
        }

        @Override
        public ServletOutputStream getOutputStream() throws IOException {
            if (stream == null) {
                ServletOutputStream real = super.getOutputStream();
                stream = new ServletOutputStream() {
                    @Override
                    public void write(int b) throws IOException {
                        real.write(b);
                        keep(new byte[] {(byte) b}, 0, 1);
                    }

                    @Override
                    public void write(byte[] b, int off, int len) throws IOException {
                        real.write(b, off, len);
                        keep(b, off, len);
                    }

                    @Override
                    public void flush() throws IOException {
                        real.flush();
                    }

                    @Override
                    public boolean isReady() {
                        return real.isReady();
                    }

                    @Override
                    public void setWriteListener(WriteListener listener) {
                        real.setWriteListener(listener);
                    }
                };
            }
            return stream;
        }

        @Override
        public PrintWriter getWriter() throws IOException {
            if (writer == null) {
                String encoding = getCharacterEncoding() == null ? "UTF-8" : getCharacterEncoding();
                writer = new PrintWriter(new java.io.OutputStreamWriter(getOutputStream(), encoding), true);
            }
            return writer;
        }

        @Override
        public void flushBuffer() throws IOException {
            if (writer != null) writer.flush();
            super.flushBuffer();
        }
    }
}
