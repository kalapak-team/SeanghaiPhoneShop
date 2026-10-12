package com.seanghai.phoneshop.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * Converts Neon / Railway style {@code DATABASE_URL}
 * ({@code postgresql://user:pass@host/db?sslmode=require}) into Spring datasource properties.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        // Prefer explicit Spring datasource env vars when both are set
        if (hasText(environment.getProperty("SPRING_DATASOURCE_URL"))) {
            return;
        }

        String databaseUrl = environment.getProperty("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.isBlank()) {
            return;
        }

        try {
            Map<String, Object> props = parse(databaseUrl.trim());
            environment.getPropertySources().addFirst(new MapPropertySource("databaseUrl", props));
        } catch (Exception ex) {
            throw new IllegalStateException("Invalid DATABASE_URL: " + ex.getMessage(), ex);
        }
    }

    static Map<String, Object> parse(String raw) throws Exception {
        String normalized = raw;
        if (normalized.startsWith("postgres://")) {
            normalized = "postgresql://" + normalized.substring("postgres://".length());
        }
        if (!normalized.startsWith("postgresql://")) {
            throw new IllegalArgumentException("Expected postgresql:// or postgres:// URL");
        }

        URI uri = URI.create(normalized);
        String userInfo = uri.getUserInfo();
        if (userInfo == null || userInfo.isBlank()) {
            throw new IllegalArgumentException("Missing username/password in DATABASE_URL");
        }

        String username;
        String password = "";
        int colon = userInfo.indexOf(':');
        if (colon >= 0) {
            username = decode(userInfo.substring(0, colon));
            password = decode(userInfo.substring(colon + 1));
        } else {
            username = decode(userInfo);
        }

        String host = uri.getHost();
        int port = uri.getPort() > 0 ? uri.getPort() : 5432;
        String path = uri.getPath();
        if (path == null || path.length() < 2) {
            throw new IllegalArgumentException("Missing database name in DATABASE_URL");
        }
        String database = path.startsWith("/") ? path.substring(1) : path;

        String query = uri.getRawQuery();
        StringBuilder jdbc = new StringBuilder("jdbc:postgresql://")
                .append(host)
                .append(':')
                .append(port)
                .append('/')
                .append(database);

        if (query != null && !query.isBlank()) {
            StringBuilder filtered = new StringBuilder();
            for (String part : query.split("&")) {
                if (part.isBlank()) continue;
                String key = part.split("=", 2)[0].toLowerCase();
                // JDBC driver does not use libpq channel_binding the same way
                if ("channel_binding".equals(key)) continue;
                if (!filtered.isEmpty()) filtered.append('&');
                filtered.append(part);
            }
            if (!filtered.isEmpty()) {
                jdbc.append('?').append(filtered);
            } else {
                jdbc.append("?sslmode=require");
            }
        } else {
            jdbc.append("?sslmode=require");
        }

        Map<String, Object> props = new HashMap<>();
        props.put("spring.datasource.url", jdbc.toString());
        props.put("spring.datasource.username", username);
        props.put("spring.datasource.password", password);
        return props;
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 10;
    }
}
