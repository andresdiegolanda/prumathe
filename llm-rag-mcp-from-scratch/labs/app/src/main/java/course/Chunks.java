package course;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Stream;

import org.springframework.ai.document.Document;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Lesson 14: from files to chunks. Two strategies over the same Markdown runbooks: one chunk per
 * section (the heading tells where a section starts), or windows of a fixed number of characters
 * that overlap and ignore the structure.
 */
@Component
class Chunks {

    private final Path corpus;

    Chunks(@Value("${course.corpus}") Path corpus) {
        this.corpus = corpus;
    }

    /** The runbooks in English and Spanish, plus the vendor notes of lesson 19 when asked. */
    List<Path> files(boolean extra) throws IOException {
        List<Path> out = new ArrayList<>();
        for (String dir : extra ? List.of("en", "es", "extra") : List.of("en", "es")) {
            try (Stream<Path> s = Files.list(corpus.resolve(dir))) {
                out.addAll(s.filter(p -> p.toString().endsWith(".md")).sorted().toList());
            }
        }
        return out;
    }

    String source(Path file) {
        return corpus.relativize(file).toString().replace('\\', '/');
    }

    static String lang(String source) {
        return source.startsWith("es/") || source.startsWith("extra/es") ? "es" : "en";
    }

    /** One chunk per "## " section, headed by the title of the file and of the section. */
    List<Document> bySection(Path file) throws IOException {
        String source = source(file);
        List<String> lines = Files.readAllLines(file, StandardCharsets.UTF_8);
        String title = lines.stream().filter(l -> l.startsWith("# ")).findFirst().map(l -> l.substring(2).strip()).orElse(source);
        List<Document> out = new ArrayList<>();
        String section = null;
        StringBuilder body = new StringBuilder();
        for (String line : lines) {
            if (line.startsWith("# ")) continue;
            if (line.startsWith("## ")) {
                add(out, source, title, section, body);
                section = line.substring(3).strip();
                body.setLength(0);
            } else {
                body.append(line).append('\n');
            }
        }
        add(out, source, title, section, body);
        return out;
    }

    private void add(List<Document> out, String source, String title, String section, StringBuilder body) {
        String text = body.toString().strip();
        if (text.isEmpty()) return;
        String name = section == null ? title : section;
        String content = title + (section == null ? "" : " > " + section) + "\n\n" + text;
        out.add(document(source, name, out.size(), content));
    }

    /** Windows of size characters, each one starting overlap characters before the previous end. */
    List<Document> fixed(Path file, int size, int overlap) throws IOException {
        if (overlap >= size) throw new CourseError("--overlap must be smaller than --chunk.");
        String source = source(file);
        String text = Files.readString(file, StandardCharsets.UTF_8).strip();
        List<Document> out = new ArrayList<>();
        for (int start = 0; start < text.length(); start += size - overlap) {
            int end = Math.min(text.length(), start + size);
            out.add(document(source, "characters " + start + "-" + end, out.size(), text.substring(start, end)));
            if (end == text.length()) break;
        }
        return out;
    }

    private static Document document(String source, String section, int index, String content) {
        String id = UUID.nameUUIDFromBytes((source + "#" + index).getBytes(StandardCharsets.UTF_8)).toString();
        // trust says where a chunk comes from: the runbooks of the platform, or an external note.
        String trust = source.startsWith("extra/") ? "external" : "runbook";
        return Document.builder().id(id).text(content)
                .metadata(Map.of("source", source, "section", section, "lang", lang(source), "chunk", index, "trust", trust))
                .build();
    }
}
