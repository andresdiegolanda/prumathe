package course;

import java.util.Arrays;

import org.springframework.boot.Banner;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

/**
 * The Spring AI application of the course. Three ways to run the same jar: a command
 * ({@code docker compose run --rm app <command> ...}) that runs once and exits; with the mcp
 * profile, the MCP server of the course on port 8081; with the mcp and stdio profiles, the same
 * server over stdin and stdout.
 */
@SpringBootApplication
public class CourseApp {

    public static void main(String[] args) {
        String profiles = Arrays.stream(args).filter(s -> s.startsWith("--spring.profiles.active=")).findFirst().orElse("");
        boolean http = profiles.contains("mcp") && !profiles.contains("stdio");
        new SpringApplicationBuilder(CourseApp.class)
                .bannerMode(Banner.Mode.OFF)
                .web(http ? WebApplicationType.SERVLET : WebApplicationType.NONE)
                .logStartupInfo(false)
                .run(args);
    }
}
