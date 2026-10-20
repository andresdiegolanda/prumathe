package course;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/** Embeddings: a text becomes a vector, and close meanings become close vectors. */
final class Vectors {
    private Vectors() {}

    static final String MODEL = Http.env("EMBED_MODEL", "qwen3-embedding-0.6b");

    static List<double[]> vectors(List<String> texts) throws Exception {
        ObjectNode req = Http.object().put("model", MODEL);
        texts.forEach(req.putArray("input")::add);
        List<double[]> out = new ArrayList<>();
        for (JsonNode d : Http.post(Http.embed() + "/v1/embeddings", req).path("data")) {
            JsonNode e = d.path("embedding");
            double[] v = new double[e.size()];
            for (int i = 0; i < v.length; i++) v[i] = e.get(i).asDouble();
            out.add(v);
        }
        return out;
    }

    static double norm(double[] v) {
        double s = 0;
        for (double x : v) s += x * x;
        return Math.sqrt(s);
    }

    static double cosine(double[] a, double[] b) {
        double dot = 0;
        for (int i = 0; i < a.length; i++) dot += a[i] * b[i];
        return dot / (norm(a) * norm(b));
    }

    static void embed(Lab.Args a) throws Exception {
        double[] v = vectors(List.of(a.text(0))).get(0);
        System.out.println("Text: " + Tokens.quote(a.text(0)));
        System.out.println("Vector of " + v.length + " numbers. The first eight:");
        StringBuilder s = new StringBuilder("  ");
        for (int i = 0; i < 8; i++) s.append(String.format("%+.4f ", v[i]));
        System.out.println(s.toString().stripTrailing() + " ...");
        System.out.printf("Length (norm) %.4f: the server normalizes, so only the direction carries meaning.%n", norm(v));
    }

    static void similar(Lab.Args a) throws Exception {
        List<String> texts = a.texts();
        if (texts.size() < 2) throw new LabError("similar needs at least two texts.");
        List<double[]> vs = vectors(texts);
        for (int i = 0; i < texts.size(); i++) System.out.println("  T" + (i + 1) + "  " + Tokens.quote(texts.get(i)));
        System.out.println("Cosine similarity (1 = same direction):");
        StringBuilder head = new StringBuilder("        ");
        for (int j = 0; j < texts.size(); j++) head.append(String.format("%6s", "T" + (j + 1)));
        System.out.println(head);
        for (int i = 0; i < texts.size(); i++) {
            StringBuilder row = new StringBuilder(String.format("  %-6s", "T" + (i + 1)));
            for (int j = 0; j < texts.size(); j++) row.append(String.format("%6.2f", cosine(vs.get(i), vs.get(j))));
            System.out.println(row);
        }
    }
}
