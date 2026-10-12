package com.seanghai.phoneshop.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.util.Map;

/**
 * Builds a Hikari DataSource from Neon/Railway {@code DATABASE_URL}.
 * More reliable on Railway than relying only on EnvironmentPostProcessor.
 */
@Configuration
@ConditionalOnProperty(name = "DATABASE_URL")
public class DatabaseUrlDataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseUrlDataSourceConfig.class);

    @Bean
    @Primary
    public DataSource dataSource(@Value("${DATABASE_URL}") String databaseUrl) throws Exception {
        Map<String, Object> props = DatabaseUrlEnvironmentPostProcessor.parse(databaseUrl.trim());
        String jdbcUrl = String.valueOf(props.get("spring.datasource.url"));
        String username = String.valueOf(props.get("spring.datasource.username"));
        String password = String.valueOf(props.get("spring.datasource.password"));

        log.info("Using DATABASE_URL → {}", jdbcUrl.replaceAll("://([^@/]+)@", "://***@"));

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setMaximumPoolSize(5);
        config.setConnectionTimeout(30_000);
        config.setInitializationFailTimeout(60_000);
        return new HikariDataSource(config);
    }
}
