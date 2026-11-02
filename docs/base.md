🏠 Organizador Familiar Digital

A sua geladeira na palma da mão: Substitua os papéis e bilhetes colados na geladeira por um aplicativo simples, prático e colaborativo para a sua família.

📌 Visão Geral do Projeto

O Organizador Familiar Digital é um sistema web responsivo desenvolvido para facilitar o dia a dia e a comunicação das tarefas domésticas. Em vez de anotações soltas, quadros brancos ou listas de compras de papel, a família se conecta a um espaço único usando um código de acesso simples.

🎯 Objetivo

Proporcionar uma ferramenta leve e intuitiva onde todos os moradores da casa possam visualizar, adicionar e marcar como concluídas as pendências do lar em tempo real.

🚀 Principais Funcionalidades

1. 🔑 Acesso Simplificado por Código de Família

Entrada Rápida: O usuário insere um código único (ex: CASA-1234 ou FAMILIA-SILVA) para entrar no painel da casa.

Perfis Simplificados: Escolha ou identificação rápida do membro da família (ex: "Mãe", "João", "Ana") para saber quem criou ou concluiu uma tarefa.

2. 🛒 Lista de Compras de Mercado

Adição Dinâmica: Qualquer membro pode adicionar itens que estão faltando.

Categorização: Organização simples por setores (Hortifrúti, Limpeza, Padaria, etc.).

Modo Mercado: Checkbox simples para ir marcando os itens enquanto estiver no mercado.

3. 🧹 Quadro de Tarefas Domésticas (Quem Faz o Quê)

Divisão de Tarefas: Atribuição de afazeres diários, semanais ou eventuais (ex: Lavar a louça, Tirar o lixo, Dar banho no pet).

Status da Tarefa: Visualização clara do que está Pendente, Em Andamento ou Concluído.

Filtros por Pessoa: Veja rapidamente apenas as suas tarefas do dia.

4. 📌 Mural de Avisos (A "Geladeira Virtual")

Recados rápidos para todos da casa (ex: "A chave reserva está no armário da sala", "Chego mais tarde hoje").

📱 Fluxo do Usuário (User Flow)

[ Tela Inicial ] ──> Insere o Código da Família ──> Seleciona seu Nome
                                 │
                                 ▼
                       [ Painel da Casa ]
                         ├── 🛒 Lista de Compras
                         ├── 🧹 Tarefas da Casa
                         └── 📌 Mural de Avisos


Acesso: O usuário abre o site pelo navegador do celular.

Autenticação: Digita o código da sua família.

Navegação: Acessa as abas de Compras, Tarefas ou Avisos.

Interação: Adiciona novos itens, marca tarefas concluídas ou deixa um recado.

🛠️ Sugestão de Tecnologias (Tech Stack)

Para manter o projeto leve e simples de usar em casa:

Frontend:

HTML5, CSS3 / Tailwind CSS (Interface limpa e amigável para celular)

React, Vue.js ou JavaScript Vanilla

Backend:

Node.js (Express) ou Python (FastAPI / Flask)

Banco de Dados:

supabase(gratuito e funcional para esse projeto)

Tempo Real (Opcional):

WebSockets (Socket.io) para atualizar a lista do mercado instantaneamente no celular de todos.

🔮 Próximas Atualizações (Roadmap Futuro)

[ ] Notificações: Alertas no celular para tarefas prioritárias.

[ ] Calendário Familiar: Acompanhamento de contas a pagar e compromissos.

[ ] Modo Escuro: Para facilitar a visualização à noite.

Projeto focado na simplicidade e praticidade para o lar.