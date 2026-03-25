# Use Gradle image to build the application
FROM gradle:8.5-jdk17 AS build

# Set working directory
WORKDIR /app

# Copy the build files and download dependencies
COPY build.gradle settings.gradle ./
RUN gradle dependencies --no-daemon -Dorg.gradle.jvmargs="-Xmx256m"

# Copy source code
COPY src ./src

# Build the application (skip tests for faster build)
RUN gradle clean build -x test --no-daemon -Dorg.gradle.jvmargs="-Xmx300m"

# Use JDK image to run the application
FROM eclipse-temurin:21-jre

# Set working directory
WORKDIR /app

# Copy the jar file from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
