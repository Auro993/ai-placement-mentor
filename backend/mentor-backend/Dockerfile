# Build stage
FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml from the correct location
COPY backend/mentor-backend/pom.xml .
RUN mvn dependency:go-offline

# Copy source code from the correct location
COPY backend/mentor-backend/src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]