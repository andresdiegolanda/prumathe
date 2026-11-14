package rumbo;

import java.util.LinkedHashMap;
import java.util.Map;

/** A JSON object whose keys keep the order they are written in, so every answer reads the same. */
final class Json {
    private Json() {
    }

    static Map<String, Object> of(Object... pairs) {
        Map<String, Object> map = new LinkedHashMap<>();
        for (int i = 0; i < pairs.length; i += 2) map.put((String) pairs[i], pairs[i + 1]);
        return map;
    }
}
