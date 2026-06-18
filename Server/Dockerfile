# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy the pom.xml and download dependencies to leverage Docker layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the application jar
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime container
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the compiled jar from the build stage
COPY --from=build /app/target/drive-locker.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
