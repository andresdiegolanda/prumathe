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
 * server over stdin and stdout. Each of them writes events for the live viewer.
 */
@SpringBootApplication
public class CourseApp {

    public static void main(String[] args) throws Exception {
        String profiles = Arrays.stream(args).filter(s -> s.startsWith("--spring.profiles.active=")).findFirst().orElse("");
        boolean mcp = profiles.contains("mcp");
        boolean stdio = profiles.contains("stdio");
        if (!mcp) {
            Events.start(args);
            WireProxy.start();
        } else if (stdio) {
            StdioLog.install();
        }
        new SpringApplicationBuilder(CourseApp.class)
                .bannerMode(Banner.Mode.OFF)
                .web(mcp && !stdio ? WebApplicationType.SERVLET : WebApplicationType.NONE)
                .logStartupInfo(false)
                .run(args);
    }
}
