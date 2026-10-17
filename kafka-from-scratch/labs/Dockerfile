FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /src
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q package

FROM eclipse-temurin:21-jre
WORKDIR /course
COPY --from=build /src/target/course-lab.jar /course/course-lab.jar
# JVM options live here rather than in JAVA_TOOL_OPTIONS, so every lab command prints only its
# own output (JAVA_TOOL_OPTIONS makes the JVM announce itself on each start).
ENTRYPOINT ["java", "-Xmx512m", "-Dorg.slf4j.simpleLogger.defaultLogLevel=warn", "-jar", "/course/course-lab.jar"]
CMD ["help"]
