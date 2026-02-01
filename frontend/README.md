# 🗳️ Frontend - Sistema de Votação

Interface React + TypeScript para o sistema de votação fullstack.

## 📋 Pré-requisitos

- **Node.js** 18+
- **npm** ou **yarn**

## 🚀 Como Iniciar

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

### Build de Produção

```bash
npm run build
```

O build será gerado em `dist/`

### Preview de Produção

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## 📁 Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ErrorBoundary.tsx
│   └── PrivateRoute.tsx
├── contexts/            # Context API
│   └── AuthContext.tsx
├── pages/               # Páginas da aplicação
│   ├── Login.tsx
│   └── pauta/
│       ├── PautaCard.tsx
│       ├── PautaList.tsx
│       ├── PautaModalForm.tsx
│       └── VotacaoResultado.tsx
├── services/            # Serviços de API
│   ├── api.ts
│   ├── authService.ts
│   ├── errorInterceptor.ts
│   ├── pautaService.ts
│   └── index.ts
├── types/               # Tipos TypeScript
│   ├── index.ts
│   ├── LoginRequest.ts
│   ├── NovaPauta.ts
│   ├── Pauta.ts
│   ├── PautaVoto.ts
│   ├── User.ts
│   └── VotoRequest.ts
├── utils/               # Utilitários
│   └── dateUtils.ts
├── App.tsx
├── App.css
├── main.tsx
└── index.css
```

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz da pasta frontend:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

**Em Docker**, a variável é definida no `docker-compose.yml`:

```yaml
environment:
  - VITE_API_BASE_URL=http://votacao-api:8080/api/v1
```

## 🎯 Funcionalidades Principais

### Autenticação

- Login por CPF
- Persistência em localStorage
- AuthContext para gerenciar estado

### Votação

- Listagem de pautas
- Votação com validações
- Visualização de resultados em tempo real
- Contagem regressiva do tempo restante

### Tratamento de Erros

- **ErrorBoundary**: Captura erros de renderização
- **SweetAlert2**: Exibição de alertas customizados

## 🐳 Docker

### Build da Imagem

```bash
docker build -t votacao-frontend .
```

### Executar Container

```bash
docker run -p 3000:3000 \
  -e VITE_API_BASE_URL=http://localhost:8080/api/v1 \
  votacao-frontend
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run lint` - Executa ESLint
- `npm run preview` - Visualiza build de produção
