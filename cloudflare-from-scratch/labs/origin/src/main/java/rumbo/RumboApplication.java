package rumbo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/** The origin of Rumbo: the API that the Cloudflare edge of the course sits in front of. */
@SpringBootApplication
public class RumboApplication {
    public static void main(String[] args) {
        SpringApplication.run(RumboApplication.class, args);
    }
}
