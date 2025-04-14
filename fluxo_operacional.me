flowchart TD

    A[Usuário envia mensagem no WhatsApp] --> B{Mensagem recebida pelo Webhook}

    B -->|Primeira mensagem| C[Mostrar Menu Principal]
    B -->|Mensagem é "menu"| C[Mostrar Menu Principal]
    B -->|Mensagem não compreendida| D[Mensagem de erro: "Digite 'menu' para ver as opções"]

    C --> E{Usuário escolhe opção do Menu}

    E -->|Escolhe uma opção (1-10)| F[Mostrar Submenu relacionado]
    F --> G{Usuário escolhe opção do Submenu}

    G -->|Escolhe uma resposta| H[Buscar resposta no baseConhecimento.json]
    H --> I[Responder texto correspondente]

    G -->|Escolhe 'Voltar'| C[Mostrar Menu Principal novamente]

    D --> C

    subgraph Infraestrutura
        Railway[(Railway - Hospedagem)]
        GitHub[(GitHub - Repositório)]
        NodeJS[(Node.js + Express.js)]
        JSON[(BaseConhecimento.json)]
    end

    Railway --> NodeJS
    GitHub --> Railway
    NodeJS --> B
    JSON --> H
