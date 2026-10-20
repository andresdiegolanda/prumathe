package course;

/** An error the course explains in one line, without a stack trace. */
class CourseError extends RuntimeException {
    CourseError(String message) {
        super(message);
    }
}
