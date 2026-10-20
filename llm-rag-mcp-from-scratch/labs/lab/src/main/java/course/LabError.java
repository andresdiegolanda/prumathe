package course;

/** A failure the lab explains in one line, instead of a stack trace. */
final class LabError extends RuntimeException {
    LabError(String message) {
        super(message);
    }
}
