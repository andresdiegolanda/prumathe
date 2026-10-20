package course;

import java.io.ByteArrayOutputStream;
import java.io.FilterInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;

/**
 * Lesson 22 in the live viewer: with the mcp and stdio profiles, the server reads one JSON-RPC
 * message per line on stdin and writes one per line on stdout. Before the transport starts, this
 * class puts a copy on both streams that logs each line, so the viewer shows the same messages
 * it shows for HTTP. Nothing extra reaches stdout.
 */
final class StdioLog {
    private StdioLog() {}

    static void install() {
        System.setIn(new FilterInputStream(System.in) {
            private final ByteArrayOutputStream line = new ByteArrayOutputStream();

            @Override
            public int read() throws IOException {
                int b = super.read();
                if (b >= 0) take(b);
                return b;
            }

            @Override
            public int read(byte[] buf, int off, int len) throws IOException {
                int n = super.read(buf, off, len);
                for (int i = 0; i < n; i++) take(buf[off + i]);
                return n;
            }

            private void take(int b) {
                if (b == '\n') flushLine(line, "in");
                else line.write(b);
            }
        });
        PrintStream out = System.out;
        System.setOut(new PrintStream(new OutputStream() {
            private final ByteArrayOutputStream line = new ByteArrayOutputStream();

            @Override
            public void write(int b) {
                out.write(b);
                if (b == '\n') flushLine(line, "out");
                else line.write(b);
            }

            @Override
            public void write(byte[] b, int off, int len) {
                out.write(b, off, len);
                for (int i = 0; i < len; i++) {
                    if (b[off + i] == '\n') flushLine(line, "out");
                    else line.write(b[off + i]);
                }
            }

            @Override
            public void flush() {
                out.flush();
            }
        }, true, StandardCharsets.UTF_8));
    }

    private static void flushLine(ByteArrayOutputStream line, String direction) {
        String text = line.toString(StandardCharsets.UTF_8).strip();
        line.reset();
        if (text.isEmpty()) return;
        Events.serverLine(Events.object().put("transport", "stdio").put("at", System.currentTimeMillis()).put("direction", direction).put("body", Events.body(text)));
    }
}
