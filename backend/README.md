# Votação FullStack - Backend

API REST para gerenciamento e participação de sessões de votação em assembleia de cooperativas.

## 📋 Pré-requisitos

- **Java 21+** - [Download](https://www.oracle.com/java/technologies/downloads/#java21)
- **Gradle 9.3+** (incluído no projeto via gradlew)
- **PostgreSQL 16** (para produção) ou **H2** (desenvolvimento)
- **Docker** (opcional, para executar com docker-compose)

## 🚀 Iniciando o Projeto

### Executar Localmente (Desenvolvimento com H2)

1. **Clone o repositório:**
```bash
git clone https://github.com/higorcraco/desafio-votacao-fullstack.git
cd desafio-votacao-fullstack/backend
```

2. **Execute a aplicação:**
```bash
./gradlew bootRun
```

A aplicação iniciará em `http://localhost:8080`

## 🔧 Configuração

### Variáveis de Ambiente (Produção)

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/votacao_db
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=postgres
export SPRING_PROFILES_ACTIVE=prod
```

### Profiles Disponíveis

- **dev** (padrão): H2 em arquivo, logs DEBUG, H2 Console habilitado
- **prod**: PostgreSQL, logs INFO, validação de schema

## 📊 Estrutura do Projeto

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/higorcraco/votacao_fullstack/
│   │   │   ├── config/          # Configurações (CORS, Timezone)
│   │   │   ├── controller/      # Endpoints REST
│   │   │   ├── domain/          # Entidades JPA
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── exception/       # Exceções customizadas
│   │   │   ├── repository/      # Camada de persistência
│   │   │   └── service/         # Lógica de negócio
│   │   └── resources/
│   │       ├── application.yaml # Config padrão (H2)
│   │       └── application-prod.yaml # Config produção
│   └── test/
│       ├── java/                # Testes unitários
│       └── resources/
│           └── sql/             # Scripts de teste
├── config/pmd/ruleset.xml       # Regras de análise estática
├── build.gradle                 # Dependências e build
├── Dockerfile                   # Build de container
└── docker-compose.yml           # Orquestração de containers
```

## 🧪 Testes

### Executar Todos os Testes

```bash
./gradlew test
```

## 🔍 Análise de Código

### PMD - Análise Estática

```bash
./gradlew pmdMain
```

Relatório gerado em: `build/reports/pmd/main.html`

Detecta:
- Código morto
- Variáveis não utilizadas
- Métodos muito longos
- Problemas de performance

## 📚 Endpoints Principais

### Autenticação
- `POST /auth/login` - Login por CPF

### Pautas
- `GET /pautas` - Listar pautas
- `POST /pautas` - Criar pauta
- `GET /pautas/{id}` - Detalhes da pauta

### Votação
- `POST /pautas/{id}/votos` - Adicionar voto

### Monitoramento (Actuator)
- `GET /actuator/health` - Status de saúde
- `GET /actuator/info` - Informações da app
- `GET /actuator/metrics` - Métricas

### Ferramentas
- `GET /h2-console` - Console H2 (apenas dev)

## 📖 Documentação Adicional

- [PMD.md](./PMD.md) - Análise estática de código
- [Dockerfile](./Dockerfile) - Imagem Docker
- [docker-compose.yml](../docker-compose.yml) - Orquestração