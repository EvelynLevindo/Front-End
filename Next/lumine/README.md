# Lumine — Sistema de Gestão Bibliotecária Comunitária

Lumine é uma solução web full-stack desenvolvida para a biblioteca comunitária **Ler é Viver**, substituindo controles manuais e cadernos por um sistema digital moderno, seguro, intuitivo e com identidade visual vintage inspirada em bibliotecas históricas.

---

## 📚 Tecnologias Utilizadas
- **Frontend & Full-Stack**: [Next.js 16](https://nextjs.org) com App Router e TypeScript
- **Estilização**: SCSS nativo com design tokens inspirados no protótipo [Stitch](https://stitch.google.com/projects/1681742832958612366)
- **Banco de Dados**: MongoDB com Mongoose (Singleton connection pool)
- **Segurança**: Bcrypt para hashing de senhas e JWT (JSON Web Tokens) com Cookies HTTP-Only
- **Tipografia**: *Playfair Display* (títulos nobres) e *Plus Jakarta Sans* (corpo e controles)

---

## 🚀 Como Executar o Projeto

### 1. Clonar e Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```
As variáveis padrão já estão configuradas para execução com o MongoDB local:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/lumine
JWT_SECRET=lumine_vintage_library_jwt_secure_key_2024_auth_secret_998877
JWT_EXPIRES_IN=7d
ADMIN_INITIAL_NAME=Felipe Silva
ADMIN_INITIAL_EMAIL=felipe.silva@lereviver.org.br
ADMIN_INITIAL_PASSWORD=Lumine@2024
```

### 3. Popular o Banco de Dados (Seed Inicial)
Execute a carga de dados para criar o primeiro usuário bibliotecário e popular o catálogo com livros, membros e empréstimos:
```bash
npm run seed
```

### 4. Executar em Desenvolvimento
```bash
npm run dev
```
Acesse a aplicação no navegador em: `http://localhost:3000`

---

## 🔐 Credenciais de Acesso Administrativo
- **URL de Acesso**: [http://localhost:3000/login](http://localhost:3000/login)
- **E-mail**: `felipe.silva@lereviver.org.br`
- **Senha**: `Lumine@2024`

---

## 🧪 Testes Automatizados
O projeto conta com um script automatizado que testa todo o ciclo de vida da biblioteca (autenticação, validação de disponibilidade, bloqueio de empréstimo duplicado, bloqueio de exclusão indevida e devolução com restauração de status):
```bash
node scripts/test-lifecycle.js
```

Para gerar a build de produção otimizada:
```bash
npm run build
```

---

## 📖 Documentação Técnica Completa
Para consultar o relatório técnico completo contendo:
- Visão Geral e Requisitos (RF, RNF, RN)
- Modelagem com Diagramas Mermaid (Casos de Uso, Classes/ER, Fluxogramas)
- Documentação detalhada de cada endpoint da API REST
- Arquitetura de Software e Medidas de Segurança
- Plano de Testes e Checklist de Requisitos

Acesse o arquivo: **[`DOCUMENTACAO_TECNICA.md`](./DOCUMENTACAO_TECNICA.md)**.
