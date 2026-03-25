# Build stage
FROM gradle:8.5-jdk17 AS build
WORKDIR /app
COPY . .
# Disable daemon and limit memory to prevent OOM on Render Free Tier
RUN gradle build -x test --no-daemon -Dorg.gradle.jvmargs="-Xmx300m"

# Package stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
