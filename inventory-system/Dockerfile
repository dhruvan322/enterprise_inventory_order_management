# Use Gradle 8.5 with JDK 17 to build the application
FROM gradle:8.5-jdk17 AS build

# Set working directory
WORKDIR /app

# Copy build files first for Docker layer caching
COPY build.gradle settings.gradle ./

# Copy source code
COPY src ./src

# Build the application (skip tests for faster build and limit Render memory footprint)
RUN gradle clean build -x test --no-daemon -Dorg.gradle.jvmargs="-Xmx512m"

# Use lightweight JRE image to run the application
FROM eclipse-temurin:17-jre

# Set working directory
WORKDIR /app

# Copy the jar file from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
