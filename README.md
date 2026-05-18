# Sistema de Estadísticas de Fórmula 1

**Universidad de Estudios de Bogotá — Facultad de Ingeniería**
Proyecto Final — Bases de Datos I · Mayo 2026

---

## Descripción del Proyecto

Sistema de información que modela el funcionamiento de la Fórmula 1 —pilotos, equipos, circuitos, temporadas, carreras, sesiones y reglamentos— y permite obtener resultados y estadísticas de forma consistente a partir de ese modelo.

El dominio cubre: catálogo de pilotos, equipos, circuitos y temporadas; registro de carreras (GPs, sprints, clasificaciones); resultados por sesión (posición, vueltas, tiempos, abandonos); estadísticas derivadas (podios, victorias, poles, vueltas rápidas); campeonatos y clasificaciones (standings de pilotos y constructores, evolución carrera a carrera); y trazabilidad analítica (rendimiento por circuito, head-to-head, tendencias por temporada).

---

## Arquitectura

```
┌──────────────────────────────────────┐     ┌──────────────────────────────┐
│         Host (Mac / PC)              │     │   VM Ubuntu — VirtualBox     │
│                                      │     │                              │
│  ┌─────────────┐  ┌───────────────┐  │     │  ┌────────────────────────┐  │
│  │  React FE   │  │  Spring Boot  │──┼─────┼─▶│  MySQL 8.0             │  │
│  │  puerto     │  │  BE           │  │     │  │  base de datos:        │  │
│  │  3001       │  │  puerto 8080  │  │     │  │  formula1              │  │
│  └─────────────┘  └───────────────┘  │     │  └────────────────────────┘  │
└──────────────────────────────────────┘     └──────────────────────────────┘
```

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| UI | Material UI v7 + Recharts |
| Backend | Spring Boot 3 + Java |
| ORM | Spring Data JPA / Hibernate |
| Base de datos | MySQL 8.0 |
| Documentación API | SpringDoc OpenAPI (Swagger UI) |

---

## Estructura del Repositorio

```
formula1-code/
├── formula1-fe/          # Aplicación React (frontend)
│   ├── src/
│   │   ├── pages/        # Dashboard, Pilotos, Equipos, Circuitos,
│   │   │                 # Temporadas, Carreras, Estadísticas, Admin
│   │   ├── components/   # Navbar, Sidebar, StatsCard, LoadingSpinner…
│   │   ├── services/     # Clientes HTTP (Axios) hacia el BE
│   │   ├── context/      # SeasonContext, AuthContext
│   │   ├── hooks/        # useFetch, useFormValidation, useAdminSnackbar
│   │   └── utils/        # formatters, constants (colores, circuitos, fotos)
│   └── package.json
│
├── formula1-be/          # API REST Spring Boot (backend)
│   └── src/main/java/com/formula1/
│       ├── controller/   # Endpoints REST
│       ├── service/      # Lógica de negocio
│       ├── repository/   # Interfaces JPA
│       ├── model/
│       │   ├── entity/   # Entidades JPA (tablas)
│       │   └── dto/      # Data Transfer Objects
│       └── config/       # DataLoader, seguridad CORS
│
└── GUIA_VM_Y_BD.md       # Guía de configuración de la VM y MySQL
```

---

## Documentación de la API — Swagger

Con el backend corriendo, la documentación interactiva está disponible en:

| Recurso | URL |
|---|---|
| **Swagger UI** | http://localhost:8080/api/swagger-ui.html |
| **OpenAPI JSON** | http://localhost:8080/api/api-docs |

---

## Endpoints Disponibles

| Recurso | Base URL |
|---|---|
| Autenticación | `POST /api/auth/login` |
| Pilotos | `/api/pilotos` |
| Escuderías | `/api/escuderias` |
| Circuitos | `/api/circuitos` |
| Temporadas | `/api/temporadas` |
| Grandes Premios | `/api/gps` |
| Sesiones | `/api/sesiones` |
| Resultados de Carrera | `/api/resultados/carrera` |
| Resultados de Clasificación | `/api/resultados/clasificacion` |
| Puntos Resultado | `/api/puntos-resultado` |
| Contratos | `/api/contratos` |

Endpoints destacados:

```
GET  /api/temporadas/{anio}                        → Datos de una temporada
GET  /api/temporadas/{anio}/clasificacion/pilotos  → Standings de pilotos
GET  /api/temporadas/{anio}/clasificacion/constructores → Standings de constructores
GET  /api/temporadas/{anio}/gps                    → GPs de la temporada
GET  /api/pilotos/{tipoDoc}/{numDoc}                → Perfil de un piloto
GET  /api/pilotos/{id}/resultados                  → Resultados de un piloto
GET  /api/pilotos/{id}/clasificacion               → Clasificaciones del piloto
GET  /api/contratos/count/anio/{anio}              → Pilotos en parrilla por año
GET  /api/circuitos/{id}                           → Detalle de un circuito
GET  /api/sesiones/gp/{idGP}                       → Sesiones de un GP
```

---

## Configuración y Puesta en Marcha

### Requisitos previos

- Java 17+
- Node.js 18+
- MySQL 8.0 (local o en VM)
- Maven 3.8+

### Base de datos

1. Crear la base de datos y ejecutar los scripts en orden:

```sql
-- 1. Estructura
source 06_script_sql/DDL.sql

-- 2. Datos base (roles, pilotos históricos, circuitos, escuderías)
source 06_script_sql/datos_iniciales.sql
source 06_script_sql/pilotos_historicos.sql

-- 3. Temporadas (elegir las necesarias)
source 06_script_sql/temporada_2023.sql
source 06_script_sql/temporada_2024.sql
source 06_script_sql/temporada_2025.sql
source 06_script_sql/temporada_2026.sql

-- O todo en un solo archivo:
source 06_script_sql/formula1_completo.sql
```

### Backend (Spring Boot)

```bash
cd formula1-be
./mvnw spring-boot:run
```

El backend quedará disponible en `http://localhost:8080/api`.

Configuración de la conexión en `src/main/resources/application.properties`:

```properties
# Base de datos local
spring.datasource.url=jdbc:mysql://localhost:3306/formula1
spring.datasource.username=root
spring.datasource.password=root123456

# Base de datos en VM (descomentar si aplica)
# spring.datasource.url=jdbc:mysql://192.168.1.65:3306/formula1
# spring.datasource.username=f1_admin
# spring.datasource.password=adminf1123
```

### Frontend (React + Vite)

```bash
cd formula1-fe
npm install
npm run dev
```

La aplicación quedará disponible en `http://localhost:3001`.

---

## Modelo de Datos

El sistema cuenta con **16 entidades**: 9 fuertes y 7 débiles. La jerarquía IS-A agrupa a `PERSONA` como supertipo de `USUARIO` y `PILOTO`.

| Entidad | Tipo | Propietaria |
|---|---|---|
| ROL | Fuerte | — |
| PERSONA | Fuerte (supertipo IS-A) | — |
| USUARIO | Fuerte (subtipo IS-A) | — |
| PILOTO | Fuerte (subtipo IS-A) | — |
| ESCUDERIA | Fuerte | — |
| CONTRATO | Asociativa | — |
| TEMPORADA | Fuerte | — |
| REGLA_PUNTUACION | **Débil** | TEMPORADA |
| CIRCUITO | Fuerte | — |
| VARIANTE_CIRCUITO | **Débil** | CIRCUITO |
| GRAN_PREMIO | Fuerte | — |
| SESION | **Débil** | GRAN_PREMIO |
| RESULTADO_CARRERA | **Débil** | SESION |
| RESULTADO_CLASIFICACION | **Débil** | SESION |
| PENALIZACION | **Débil** | RESULTADO_CARRERA |
| CLASIFICACION_CAMPEONATO | Fuerte (asociativa) | — |

---

## Supuestos del Negocio

- El sistema cubre el Campeonato Mundial de F1 en el rango **2010–2026**.
- Toda entidad tiene identificador interno único; los registros no se eliminan físicamente (se desactivan o marcan como retirados/inactivos).
- Un piloto puede tener solo un contrato vigente por equipo en una temporada.
- Solo `CARRERA` y `SPRINT` generan `RESULTADO_CARRERA`; solo `CLASIFICACION` genera `RESULTADO_CLASIFICACION`.
- Los puntos en `resultado_carrera` son derivados de `regla_puntuacion` pero se almacenan por eficiencia.
- Las condiciones de pista válidas son: `SECA`, `MOJADA`, `MIXTA`.
- Los tipos de sesión válidos son: `FP1`, `FP2`, `FP3`, `CLASIFICACION`, `SPRINT_CLASIFICACION`, `SPRINT`, `CARRERA`.

---

## Analítica Disponible

- Clasificación final de pilotos y constructores por temporada (posición, puntos, victorias, podios, poles).
- Evolución del campeonato carrera a carrera.
- Head-to-head entre pilotos (carrera y qualifying).
- Estadísticas de abandono (DNF) y de finalización en puntos.
- Mejor y peor posición por circuito y temporada.
- Tasa de apariciones en Q2/Q3; posición media de parrilla.

---

## Credenciales por Defecto (DataLoader)

| Campo | Valor |
|---|---|
| Usuario admin | `ADMIN_F1` |
| Contraseña | `admin123` |
| Rol | `ADMIN` |

---

*Sistema desarrollado como proyecto final de Bases de Datos I — UEB, Mayo 2026.*
