package com.mustafayoruk.todolistfullstack.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");

        String rawUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = System.getenv("DATABASE_URL");
        }

        String username = System.getenv("SPRING_DATASOURCE_USERNAME");
        String password = System.getenv("SPRING_DATASOURCE_PASSWORD");

        if (rawUrl != null && !rawUrl.isBlank()) {
            try {
                String cleanUrl = rawUrl.trim();
                if (cleanUrl.startsWith("postgres://") || cleanUrl.startsWith("postgresql://")) {
                    String uriString = cleanUrl.startsWith("postgres://") ?
                            "http://" + cleanUrl.substring("postgres://".length()) :
                            "http://" + cleanUrl.substring("postgresql://".length());

                    URI uri = new URI(uriString);
                    if (uri.getUserInfo() != null) {
                        String[] userInfo = uri.getUserInfo().split(":");
                        if (userInfo.length >= 1 && !userInfo[0].isEmpty() && (username == null || username.isBlank())) {
                            username = userInfo[0];
                        }
                        if (userInfo.length >= 2 && (password == null || password.isBlank())) {
                            password = userInfo[1];
                        }
                    }

                    String host = uri.getHost();
                    int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                    String path = uri.getPath();

                    cleanUrl = "jdbc:postgresql://" + host + ":" + port + path;
                }

                if (!cleanUrl.startsWith("jdbc:postgresql://")) {
                    if (cleanUrl.startsWith("jdbc:postgres://")) {
                        cleanUrl = "jdbc:postgresql://" + cleanUrl.substring("jdbc:postgres://".length());
                    } else {
                        cleanUrl = "jdbc:postgresql://" + cleanUrl;
                    }
                }

                if (!cleanUrl.contains("localhost") && !cleanUrl.contains("sslmode=")) {
                    cleanUrl += cleanUrl.contains("?") ? "&sslmode=require" : "?sslmode=require";
                }

                dataSource.setUrl(cleanUrl);
            } catch (Exception e) {
                System.err.println("Error parsing database URL: " + e.getMessage());
                dataSource.setUrl(rawUrl);
            }
        } else {
            dataSource.setUrl("jdbc:postgresql://localhost:5432/to_do_list");
        }

        dataSource.setUsername(username != null && !username.isBlank() ? username : "postgres");
        dataSource.setPassword(password != null && !password.isBlank() ? password : "1234");

        return dataSource;
    }
}
