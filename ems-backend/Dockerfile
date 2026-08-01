# Build stage
FROM maven:3.9-eclipse-temurin-23 AS build

WORKDIR /app

# Copy Maven configuration first so dependencies can be cached
COPY pom.xml ./

RUN mvn dependency:go-offline -B

# Copy source code and build the Spring Boot JAR
COPY src ./src

RUN mvn clean package -DskipTests -B


# Runtime stage
FROM eclipse-temurin:23-jre

WORKDIR /app

# Run as a non-root user
RUN groupadd --system spring && \
    useradd --system --gid spring spring

COPY --from=build --chown=spring:spring /app/target/*.jar app.jar

USER spring

EXPOSE 8080

ENTRYPOINT [
    "java",
    "-XX:MaxRAMPercentage=75.0",
    "-jar",
    "app.jar"
]
