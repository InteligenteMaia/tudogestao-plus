erDiagram
    EMPRESAS {
        int id_empresa PK
        string nome
        string cnpj
    }
    USUARIOS {
        int id_usuario PK
        int id_empresa FK
        string nome
        string email
    }
    CONTAS_BANCARIAS {
        int id_conta PK
        int id_empresa FK
        string nome_banco
        string agencia
        string numero_conta
    }
    CLIENTES {
        int id_cliente PK
        int id_empresa FK
        string nome
        string cpf_cnpj
    }
    FORNECEDORES {
        int id_fornecedor PK
        int id_empresa FK
        string nome
        string cpf_cnpj
    }
    CATEGORIAS {
        int id_categoria PK
        int id_empresa FK
        string nome
        string tipo
    }
    TRANSACOES {
        int id_transacao PK
        int id_conta_bancaria FK
        int id_categoria FK
        int id_cliente FK
        int id_fornecedor FK
        string descricao
        decimal valor
        date data
    }
    NOTAS_FISCAIS {
        int id_nf PK
        int id_cliente FK
        int id_fornecedor FK
        string numero
        date data_emissao
    }
    ITENS_NF {
        int id_item_nf PK
        int id_nf FK
        string descricao_produto
        int quantidade
        decimal valor_unitario
    }

    EMPRESAS ||--o{ USUARIOS : "possui"
    EMPRESAS ||--o{ CONTAS_BANCARIAS : "possui"
    EMPRESAS ||--o{ CLIENTES : "cadastra"
    EMPRESAS ||--o{ FORNECEDORES : "cadastra"
    EMPRESAS ||--o{ CATEGORIAS : "define"
    
    CONTAS_BANCARIAS ||--o{ TRANSACOES : "registra"
    CATEGORIAS ||--o{ TRANSACOES : "classifica"
    
    CLIENTES ||--o{ TRANSACOES : "gera (receita)"
    FORNECEDORES ||--o{ TRANSACOES : "gera (despesa)"
    
    CLIENTES ||--o{ NOTAS_FISCAIS : "emitida para"
    FORNECEDORES ||--o{ NOTAS_FISCAIS : "recebida de"
    
    NOTAS_FISCAIS ||--o{ ITENS_NF : "contém"
    NOTAS_FISCAIS }o--|| TRANSACOES : "pode gerar"
    