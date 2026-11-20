# 🏠 InfoHouse — Organizador Familiar Digital

> A geladeira da sua casa na palma da mão: substitui papéis e bilhetes colados na geladeira por um app web simples, responsivo e colaborativo em tempo real.

---

## 1. Visão Geral

O **InfoHouse** é uma aplicação web (mobile-first) para organizar o dia a dia da família. Todos os moradores entram no mesmo espaço usando um **código de família**, sem cadastro nem senha, e passam a compartilhar:

- uma lista de compras de mercado;
- um quadro de tarefas domésticas;
- um mural de avisos.

Tudo é sincronizado **em tempo real**: quando alguém adiciona um item no celular, a mudança aparece instantaneamente nos aparelhos dos demais.

---

## 2. Funcionalidades

### 🔑 Acesso por código de família
- O usuário digita um código (ex.: `CASA-1234`, `FAMILIA-SILVA`); o código é normalizado para maiúsculas.
- Se o código **já existe**, entra na família; se **não existe**, a família é criada automaticamente.
- Em seguida, escolhe seu nome na lista de membros ou **cria um novo membro** (nomes são únicos dentro da família).
- A sessão fica salva no `localStorage`, então o usuário não precisa entrar de novo ao reabrir o app.
- Botão **"Sair / trocar pessoa"** para trocar de membro ou de família.

### 🛒 Lista de Compras
- Qualquer membro adiciona itens que estão faltando.
- **Categorias**: Hortifrúti, Padaria, Açougue, Laticínios, Limpeza, Higiene, Bebidas e Outros — os itens são agrupados por categoria.
- **Modo mercado**: checkbox para marcar itens já colocados no carrinho (itens marcados ficam riscados).
- Mostra quem adicionou cada item.
- Remoção individual e botão para **limpar todos os itens marcados**.

### 🧹 Quadro de Tarefas Domésticas
- Criação de tarefas com **responsável** (ou "sem responsável") e **frequência**: Diária, Semanal ou Eventual.
- **Status** em ciclo: Pendente → Em andamento → Concluída → Pendente (com cores distintas para cada estado).
- Registra **quem concluiu** a tarefa.
- Filtro **"somente minhas tarefas"**.
- Remoção de tarefas.

### 📌 Mural de Avisos ("Geladeira Virtual")
- Recados rápidos para toda a casa, exibidos como post-its amarelos.
- Cada aviso mostra **autor, data e hora**; os mais recentes aparecem primeiro.
- Remoção de avisos.

### ⚡ Tempo real e experiência de uso
- Atualização instantânea entre todos os dispositivos conectados à mesma família.
- **Atualização otimista**: a interface reage na hora e desfaz a mudança caso o banco recuse.
- Layout responsivo, pensado para celular, com navegação por abas fixas no topo.
- Tela de aviso de "Configuração pendente" quando as variáveis do Supabase não estão definidas.

---

## 3. Fluxo do Usuário

```
[ Tela inicial ] → insere o código da família → seleciona (ou cria) seu nome
                                 │
                                 ▼
                       [ Painel da Casa ]
                         ├── 🛒 Compras
                         ├── 🧹 Tarefas
                         └── 📌 Avisos
```

---

## 4. Tecnologias Utilizadas

| Camada | Tecnologia | Para que serve |
|---|---|---|
| Interface | **React 18** | Construção dos componentes e controle de estado (hooks) |
| Build / Dev server | **Vite 5** + `@vitejs/plugin-react` | Servidor de desenvolvimento rápido e build de produção |
| Estilização | **Tailwind CSS 3** + PostCSS + Autoprefixer | Estilos utilitários e layout responsivo |
| Backend / Banco | **Supabase** (PostgreSQL) | Banco de dados gerenciado e API, sem servidor próprio |
| Tempo real | **Supabase Realtime** (`postgres_changes`) | Sincronização instantânea entre dispositivos |
| Cliente | **@supabase/supabase-js 2** | Comunicação do front-end com o Supabase |
| Persistência local | **localStorage** | Guardar a sessão (família + membro) no navegador |
| Linguagem | **JavaScript (ES Modules) / JSX** | Código da aplicação |

> Não há backend próprio (Node/Python): o front-end conversa diretamente com o Supabase, o que mantém o projeto leve e gratuito para uso doméstico.

---

## 5. Estrutura do Projeto

```
infohouse/
├── index.html                  # Ponto de entrada HTML
├── package.json                # Dependências e scripts
├── vite.config.js              # Configuração do Vite
├── tailwind.config.js          # Configuração do Tailwind
├── postcss.config.js           # Configuração do PostCSS
├── .env.example                # Modelo das variáveis de ambiente
├── docs/                       # Documentos de planejamento
├── supabase/
│   └── schema.sql              # Tabelas, políticas e Realtime
└── src/
    ├── main.jsx                # Inicialização do React
    ├── App.jsx                 # Alterna entre Login e Dashboard
    ├── index.css               # Estilos globais (Tailwind)
    ├── components/
    │   ├── Login.jsx           # Código da família e escolha do membro
    │   ├── Dashboard.jsx       # Cabeçalho e navegação por abas
    │   ├── Shopping.jsx        # Lista de compras
    │   ├── Tasks.jsx           # Tarefas domésticas
    │   └── Notices.jsx         # Mural de avisos
    ├── hooks/
    │   └── useRealtimeTable.js # Hook de dados + Realtime reutilizável
    └── lib/
        ├── supabase.js         # Cliente Supabase
        └── session.js          # Sessão no localStorage
```

---

## 6. Banco de Dados

Cinco tabelas no PostgreSQL (Supabase), todas ligadas à família por `family_id` com `on delete cascade`:

| Tabela | Descrição | Campos principais |
|---|---|---|
| `families` | Famílias | `id`, `code` (único) |
| `members` | Membros da família | `family_id`, `name` (único por família) |
| `shopping_items` | Itens de compra | `name`, `category`, `done`, `added_by` |
| `tasks` | Tarefas | `title`, `frequency` (`diaria`/`semanal`/`eventual`), `status` (`pendente`/`andamento`/`concluida`), `assignee_id`, `created_by`, `completed_by` |
| `notices` | Avisos | `text`, `author_id`, `created_at` |

Detalhes técnicos:
- Chaves primárias em **UUID** (`gen_random_uuid()`).
- **Índices** em `family_id` para consultas rápidas.
- **Row Level Security** ativada, com política aberta para a chave `anon` (acesso por código, sem login).
- Tabelas adicionadas à publicação `supabase_realtime`, com `replica identity full` para que eventos de `DELETE` carreguem o `family_id`.

---

## 7. Destaques de Implementação

- **Hook `useRealtimeTable`**: um único hook genérico carrega, ordena e assina mudanças de qualquer tabela filtrada por família, e expõe `insert`, `update` e `remove`. É reutilizado em Compras, Tarefas, Avisos e Membros.
- **Atualizações otimistas com rollback**, para uma interface fluida mesmo com conexão lenta.
- **Componentização simples**: cada aba é um componente independente que recebe `familyId`, `me` e `members`.

---

## 8. Como Executar

**Pré-requisitos:** Node.js 18+ e um projeto gratuito no [Supabase](https://supabase.com).

1. **Instalar dependências**
   ```bash
   npm install
   ```
2. **Criar o banco:** no *SQL Editor* do Supabase, execute o conteúdo de `supabase/schema.sql`.
3. **Configurar variáveis:** copie `.env.example` para `.env` e preencha:
   ```env
   VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-anon-key
   ```
4. **Rodar em desenvolvimento**
   ```bash
   npm run dev
   ```
5. **Gerar build de produção**
   ```bash
   npm run build     # saída em dist/
   npm run preview   # pré-visualiza o build
   ```

---

## 9. Considerações de Segurança

O acesso é feito **apenas pelo código da família**, sem autenticação. Quem souber o código acessa os dados daquela família. Por isso, recomenda-se usar **códigos difíceis de adivinhar**. Para uso mais amplo, uma evolução natural é adotar o Supabase Auth e restringir as políticas de RLS por usuário.

---

## 10. Ideias de Evolução

- Autenticação real (Supabase Auth) e políticas de RLS por família.
- Notificações push para novos avisos e tarefas.
- Tarefas recorrentes com reinício automático (diárias/semanais).
- Transformar em PWA (instalável no celular, uso offline).
- Histórico de compras e itens favoritos.
