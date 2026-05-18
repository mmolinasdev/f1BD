package com.formula1.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI formula1OpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Formula 1 Statistics API")
                        .description("API REST para el sistema de estadísticas de Fórmula 1")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Formula 1 Statistics System")
                                .email("admin@formula1stats.com")));
    }
}
