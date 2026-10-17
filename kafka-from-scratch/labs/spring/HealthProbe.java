import java.net.URI;
import java.net.http.*;
import java.time.Duration;

// A small JRE-only probe keeps curl out of the application image.
public class HealthProbe {
    public static void main(String[] args) throws Exception {
        var response = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(2)).build()
            .send(HttpRequest.newBuilder(URI.create("http://localhost:8080/ready"))
                .timeout(Duration.ofSeconds(3)).GET().build(), HttpResponse.BodyHandlers.discarding());
        if (response.statusCode() != 200) System.exit(1);
    }
}
