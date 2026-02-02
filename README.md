# 🗳️ Desafio Técnico - Sistema de Votação Cooperativa

Este projeto é uma solução para gerenciamento de sessões de votação em assembleias de cooperativas. A aplicação permite o cadastro de pautas, abertura de sessões com tempo determinado e a contabilização de votos (Sim/Não) de associados, garantindo a unicidade do voto por CPF.

---

## Considerações

A fim de manter o projeto simples foram feitas algumas escolhas técnicas com grandes trade-offs.

Ao buscar as pautas, estamos também buscando todos os seus votos para poder computar os votos em tempo real e verificar se o usuário já votou naquela pauta, oque gera um problema de n+1.

Também seria interessante entender se o usuário deveria poder ou não ver a totalização de votos da pauta antes dela ser finalizada. Isso teria impacto em como as coisas são feitas atualmente.

Algumas soluções foram evitadas para evitar adicionar complexidade no projeto, porém resolveriam alguns dos problemas atuais. Algumas delas poderiam inclusive ser utilizadas em conjunto. Seguem as possibilidades:

#### 1. Filas

Ao adicionar os votos, poderíamos enviá-los em uma fila, onde eles seriam somados a uma tabela de totalização, podendo ter uma inconsistência do total enquanto a pauta estiver em aberto, porém eventualmente ficaria consistente.
 
#### 2. Cache

Poderíamos manter os votos das pautas em aberto em cache, reduzindo a carga ao banco. 

#### 3. Scheduler

A criação de um scheduler para totalizar as pautas fechadas minuto a minuto, poderia reduzir a carga ao banco em futuras requisições uma vez que estariam salvas as informações já totalizadas junto à pauta.

#### 4. Web-socket

Utilizar um web-socket para que a API avise o client quando uma pauta for totalizada.

#### 5. Context do usuário

O client poderia conter um context para o usuário que buscasse as pautas em aberto que o usuário votou. Dessa forma seria fácil controlar no client qual pauta o usuário pode voltar sem grandes cargas no banco de dados.



### Melhor cenário

Para mim o melhor cenário seria que o usuário não pudesse ver os votos até que a pauta fosse finalizada. Dessa forma evitamos que outros usuários possam ser influenciados e também facilitamos algumas decisões técnicas.

Nesse caso na minha visão o melhor cenário seria:

#### 🥇 Fila + Context do usuário

#### 🥈 Scheduler + Context do usuário

---

### 📌 Índice
1. [Como Executar o Projeto](#-como-executar-o-projeto)
2. [Arquitetura e Tecnologias](#-arquitetura-e-tecnologias)
3. [Escolhas Técnicas](#-escolhas-técnicas)
4. [Tarefas Bônus](#-tarefas-bônus)
5. [Documentação da API](#-documentação-da-api)

---

### 🚀 Como Executar o Projeto

A forma mais simples e recomendada de subir o ambiente completo (Backend + Frontend + Banco de Dados) é utilizando o **Docker Compose**.

Na raiz do projeto, execute:
```bash
docker-compose up -d
```

Após o processamento, as aplicações estarão disponíveis em:
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend:** [http://localhost:8080](http://localhost:8080)

> **Nota:** Para instruções detalhadas de execução individual, configurações de ambiente ou scripts de build, consulte os arquivos específicos:
> - [README do Backend](./backend/README.md)
> - [README do Frontend](./frontend/README.md)

---

### 🏗️ Arquitetura e Tecnologias

O projeto foi construído utilizando uma stack moderna e escalável:
- **Backend:** Java 17, Spring Boot 3.x, Spring Data JPA, Hibernate.
- **Frontend:** React, TypeScript, Bootstrap 5 (React Bootstrap).
- **Banco de Dados:** H2 (Desenvolvimento/Testes) e suporte a PostgreSQL (Produção).

Sugestão de arquitetura:
[arquitetura.png](assets/arquitetura.png)

---

### 💡 Escolhas Técnicas

#### 1. Persistência de Datas com `Instant`
Optou-se pelo uso de `java.time.Instant` para todas as marcações temporais. Isso garante que a aplicação seja **agnóstica a fuso horário (Timezone Agnostic)**. O backend opera estritamente em UTC, enquanto o frontend é responsável por converter e exibir a data no fuso horário local do associado.

#### 2. Identificadores UUID
Utilizamos **UUID (Universally Unique Identifier)** como chave primária para as entidades. Isso aumenta a segurança (evitando a exposição da quantidade de registros via IDs sequenciais) e facilita a escalabilidade em ambientes distribuídos.

Em um projeto grande eu recomendaria o uso do UUID V7 que melhora a indexação no banco de dados ser baseado em tempo e ordenável, ao contrário do UUIDv4, que é puramente aleatório.

#### 3. Mapeamento de DTOs
Pela simplicidade do projeto foi escolhido por implementar a própria solução de converter. Em um projeto maior, o uso de um mapStruct poderia agilizar o desenvolvimento. 

---

### 🌟 Tarefas Bônus

#### Bônus 1: Integração com Sistemas Externos (Validação de CPF)
Foi implementada uma **Facade/Client** que simula a integração com um serviço de validação de CPF.
- A lógica inclui a aleatoriedade solicitada, retornando `ABLE_TO_VOTE`, `UNABLE_TO_VOTE` ou `404 Not Found`.
- A arquitetura foi desenhada para que a substituição por uma API REST real seja feita apenas alterando a implementação do Client, sem afetar as regras de negócio.

#### Bônus 2: Performance e Testes de Carga
- Adicionado índices às tabelas do banco para melhoria da performance
- Não foi realizado teste de carga, pois eu não tinha conhecimento de como fazê-lo e devido ao limite de tempo não seria possível aprender. Eu poderia fazer utilizando uma IA, porém não parece fazer sentido em um teste técnico.

#### Bônus 3: Versionamento da API
A API foi versionada diretamente na URL (ex: `/api/v1/...`). Esta escolha foi feita pela simplicidade de consumo e clareza na documentação, permitindo que futuras versões (v2) coexistam sem quebrar clientes antigos.

Outra opção mais moderna seria o versionamento através do header.

---

### 📖 Documentação da API

A documentação interativa da API (Swagger/OpenAPI) pode ser acessada, com a aplicação rodando, em:
- [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

### 🛠️ Melhorias Futuras
- [ ] Utilização do Liquibase para obter mais controle nas alterações do banco.
- [ ] Implementação de Cache com Redis para verificar se o usuário já votou, definindo o tempo de expiração da informação pela duração da pauta.
- [ ] Autenticação JWT com Usuário no ContextHolder.
- [ ] Utilização de RSQL para buscas complexas
- [ ] Paginação

---

**Desenvolvido por:** [Higor Craco Baltieri]