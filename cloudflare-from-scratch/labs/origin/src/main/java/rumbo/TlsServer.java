package rumbo;

import com.sun.net.httpserver.HttpsConfigurator;
import com.sun.net.httpserver.HttpsServer;
import java.io.FileInputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.security.KeyStore;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * HTTPS (8443 by default) with the certificate baked into the image: signed by the course's test CA for the
 * origin, self-signed for the impostor. It is what an edge sees when it connects to the origin in
 * the Full and Full (strict) modes of lesson 03.
 */
@Component
public class TlsServer implements ApplicationRunner {
    private final String keystore, message;
    private final int port;

    TlsServer(@Value("${rumbo.tls.keystore}") String keystore, @Value("${rumbo.tls.message}") String message,
              @Value("${rumbo.tls.port}") int port) {
        this.keystore = keystore;
        this.message = message;
        this.port = port;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        KeyStore store = KeyStore.getInstance("PKCS12");
        char[] password = "rumbo-lab".toCharArray();
        try (var in = new FileInputStream(keystore)) {
            store.load(in, password);
        }
        KeyManagerFactory keys = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
        keys.init(store, password);
        SSLContext tls = SSLContext.getInstance("TLS");
        tls.init(keys.getKeyManagers(), null, null);
        HttpsServer server = HttpsServer.create(new InetSocketAddress(port), 0);
        server.setHttpsConfigurator(new HttpsConfigurator(tls));
        byte[] body = ("{\"answer\":\"" + message + "\"}\n").getBytes(StandardCharsets.UTF_8);
        server.createContext("/", exchange -> {
            exchange.getResponseHeaders().add("content-type", "application/json");
            exchange.sendResponseHeaders(200, body.length);
            try (var out = exchange.getResponseBody()) {
                out.write(body);
            }
        });
        server.start();
    }
}
