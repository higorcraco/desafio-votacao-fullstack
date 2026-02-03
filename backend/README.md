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

### JaCoCo - Test Coverage

```bash
./gradlew test
```

Gera relatório de cobertura em: `build/reports/jacoco/test/html/index.html`

Verifica cobertura mínima de 90%:

```bash
./gradlew jacocoTestCoverageVerification
```

Métricas medidas:
- Linhas de código cobertas
- Branches/decisões cobertas
- Métodos executados
- Complexidade cíclica

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

- [Dockerfile](./Dockerfile) - Imagem Docker
- [docker-compose.yml](./docker-compose.yml) - Orquestração
