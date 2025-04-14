# Bot SEI WhatsApp - MVP

Este repositório contém a estrutura de um bot de atendimento para WhatsApp focado em orientar usuários no uso do sistema **SEI (Sistema Eletrônico de Informações)**.

O bot é responsável por:
- Receber perguntas livres de usuários.
- Direcionar o usuário para um menu de opções sobre o SEI.
- Apresentar submenus detalhados.
- Retornar respostas explicativas e ilustradas de acordo com a escolha do usuário.
- Garantir uma navegação amigável e padronizada.

Este é um **MVP (Produto Mínimo Viável)** focado em testes de usabilidade e validação da experiência.

## Ferramentas utilizadas no MVP

| Ferramenta | Função |
|------------|--------|
| **Node.js** | Plataforma para executar o código backend do bot. |
| **Express.js** | Framework para gerenciar as rotas HTTP e recebimento de eventos do WhatsApp. |
| **Railway.app** | Plataforma de deploy automático do bot (aplicativo hospedado). |
| **Meta WhatsApp Business API** | API usada para envio e recebimento de mensagens no WhatsApp. |
| **GitHub** | Controle de versão do projeto e automação de atualizações no Railway. |
| **JSON (baseConhecimento.json)** | Armazena toda a base de conhecimento: menus, submenus e respostas do bot. |
| **Visual Studio Code** | IDE utilizada para desenvolvimento, edição de código e organização do projeto. |

---

## Estrutura Básica do Projeto

- **index.js**: Código principal do bot, gerenciando recebimento de mensagens, interpretação e respostas.
- **baseConhecimento.json**: Base de conhecimento que alimenta os menus e respostas dinâmicas.
- **package.json**: Gerenciamento de dependências do Node.js.

---

## Observação

Este projeto foi desenvolvido para ser facilmente expansível:
- Para adicionar novos tópicos, basta atualizar o arquivo `baseConhecimento.json`.
- Futuramente, poderemos integrar com Google Sheets ou outras fontes dinâmicas.

---

### Desenvolvido por: [Seu Nome ou Nome da Equipe] ✨

