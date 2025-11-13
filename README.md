# ⚡ Smart KiloWatch - Consumo de Energia e Água Consciente em Residências

> **Smart KiloWatch** é uma aplicação desenvolvida para promover o **monitoramento eficiente do consumo de energia elétrica e água** em residências, oferecendo ao usuário controle e conscientização sobre seus hábitos de consumo.

Este projeto foi idealizado como parte de um **Trabalho de Conclusão de Curso (TCC)** e visa a sustentabilidade doméstica através da tecnologia.

---

## 📄 Sumário

* [📘 Visão Geral do Projeto](#-visão-geral-do-projeto)
    * [⚠️ Status Atual](#️-status-atual)
* [🚀 Tecnologias e Arquitetura](#-tecnologias-e-arquitetura)
    * [🔜 Próximas Versões (Em Desenvolvimento)](#-próximas-versões-em-desenvolvimento)
* [⚙️ Funcionalidades Implementadas](#-funcionalidades-implementadas)
* [📝 Requisitos do Sistema](#-requisitos-do-sistema)
    * [Requisitos Funcionais (RF)](#requisitos-funcionais-rf)
    * [Requisitos Não Funcionais (RNF)](#requisitos-não-funcionais-rnf)
* [🧑‍💻 Guia de Instalação e Teste](#-guia-de-instalação-e-teste)
    * [🔧 Pré-requisitos](#-pré-requisitos)
    * [🚀 Clonando e Configurando o Ambiente](#-clonando-e-configurando-o-ambiente)
* [🎨 Design e Protótipo](#-design-e-protótipo)
* [📺 Demonstração](#-demonstração)
* [🤝 Contribuições](#-contribuições)
* [🧠 Desenvolvedor](#-desenvolvedor)

---

## 📘 Visão Geral do Projeto

A aplicação permite que os usuários **cadastrem suas residências, metas de consumo, eletrodomésticos e atividades do dia a dia** para monitorar, por meio de registros diários, o quanto estão consumindo de água e energia.

Com base nesses dados, o sistema oferece recursos essenciais:
* **Cálculo de custos:** Com e sem a aplicação de impostos.
* **Análise de dados:** Geração de gráficos e análises de consumo.
* **Conscientização:** Fomento à reflexão crítica sobre hábitos e sustentabilidade.

### ⚠️ Status Atual

O projeto encontra-se em suas **primeiras fases de desenvolvimento**. Por ser um TCC em andamento, **erros ou bugs podem ocorrer**.

📧 **Suporte e Feedback:**
Caso encontre algum problema ou queira sugerir melhorias, entre em contato:
`suporte.smart.kilowatch@gmail.com` ou abra uma **Issue** neste repositório.

---

## 🚀 Tecnologias e Arquitetura

O **Smart KiloWatch** é construído com tecnologias modernas para garantir uma experiência de usuário fluida e um desenvolvimento robusto:

| Componente | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend (Client)** | **React Native** | Desenvolvimento de interface moderna e responsiva para mobile. |
| **Backend (Server)** | **Node.js** | API RESTful para processamento de dados e regras de negócio. |
| **Banco de Dados** | **MySQL** | Armazenamento estruturado de dados de usuários e consumo. |
| **Design** | **Figma** | Prototipagem e design da interface do usuário. |

---

## ⚙️ Funcionalidades Implementadas

| Categoria | Funcionalidade | Status |
| :--- | :--- | :--- |
| **Usuário/Conta** | Cadastro e Login de usuários | ✅ Implementado |
| **Residência** | Cadastro com base no estado (para tarifas locais) | ✅ Implementado |
| **Monitoramento** | Cadastro e gerenciamento de eletrodomésticos | ✅ Implementado |
| **Monitoramento** | Cadastro de atividades que consomem água (banho, louça, etc.) | ✅ Implementado |
| **Cálculos** | Cálculo automático de consumo de energia e água | ✅ Implementado |
| **Custos** | Estimativa de custos mensais (com/sem impostos) | ✅ Implementado |
| **Análise** | Exibição de gráficos comparativos de consumo | ✅ Implementado |
| **Sincronização** | Armazenamento local e sincronização com o banco de dados | ✅ Implementado |
| **Interface** | Interface moderna e responsiva | ✅ Implementado |

### 🔜 Próximas Versões (Em Desenvolvimento)

* Sistema de **notificações automáticas** de consumo crítico.
* **Tutorial interativo** na primeira execução do app.

---

## 📝 Requisitos do Sistema

### Requisitos Funcionais (RF)

| Código | Descrição |
| :--- | :--- |
| **RF001** | Permitir que o usuário crie uma conta (nome, e-mail, senha). |
| **RF002** | Solicitar a região do usuário para identificação de tarifas. |
| **RF003** | Permitir o login de usuários cadastrados. |
| **RF004** | Permitir o cadastro detalhado de eletrodomésticos. |
| **RF005** | Exibir lista de eletrodomésticos cadastrados (tipo, marca, consumo). |
| **RF006** | Notificar diariamente o usuário sobre o uso de ar-condicionado e ventilador. |
| **RF007** | Permitir a organização/filtragem da lista de eletrodomésticos. |
| **RF008** | Permitir o registro diário do consumo de água (tempo de banho, lavar louça, etc.). |
| **RF009** | Exibir o consumo médio diário e mensal de água. |
| **RF010** | Calcular a média estimada de custo mensal com base no consumo. |
| **RF011** | Permitir que o usuário adicione manualmente o valor da conta mensal. |
| **RF012** | Exibir gráficos de consumo mensal de energia e água. |
| **RF013** | Enviar notificações quando o consumo atingir níveis críticos. |

### Requisitos Não Funcionais (RNF)

| Código | Descrição |
| :--- | :--- |
| **RNF001** | O sistema deve ser acessível em **smartphones, tablets e computadores** (multiplataforma). |
| **RNF002** | O código deve ser **claro e de fácil manutenção**. |
| **RNF003** | O sistema deve funcionar bem em **aparelhos de baixo desempenho**. |
| **RNF004** | O layout deve ser **simples, intuitivo** e adequado a todas as faixas etárias. |
| **RNF005** | O sistema deve ser **resiliente** e suportar picos de uso. |
| **RNF006** | O **tempo de resposta** deve ser rápido, garantindo fluidez na navegação. |

---

## 🧑‍💻 Guia de Instalação e Teste

### 🔧 Pré-requisitos

Certifique-se de que você tem as seguintes ferramentas instaladas:

* **[Node.js](https://nodejs.org/)** (Recomendado a versão LTS)
* **[Expo CLI](https://docs.expo.dev/get-started/installation/)** (`npm install -g expo-cli`)
* **[MySQL](https://dev.mysql.com/downloads/)**
* **[Git](https://git-scm.com/)**

### 🚀 Clonando e Configurando o Ambiente

1.  **Clone o Repositório:**
    ```bash
    git clone [https://github.com/VictorSantosReis12/Smart_KiloWatch.git](https://github.com/VictorSantosReis12/Smart_KiloWatch.git)
    cd smart-kilowatch
    ```

2.  **Configure o Banco de Dados (MySQL):**
    * Acesse a pasta `server/config`.
    * Localize o arquivo `db.sql`.
    * Copie o conteúdo e **crie o banco de dados** e tabelas no seu MySQL.
    * Verifique e, se necessário, ajuste as credenciais de acesso no arquivo `server/config/db.js`.

3.  **Instale as Dependências:**
    ```bash
    # Instalar dependências do Frontend (Client)
    cd client
    npm install

    # Instalar dependências do Backend (Server)
    cd ../server
    npm install
    ```

4.  **Configure o Endereço IP da API:**

    ⚠️ **Importante:** O seu computador e o celular/dispositivo de teste precisam estar na **mesma rede Wi-Fi**.

    * Descubra o **Endereço IPv4** da sua máquina (no terminal/CMD, digite `ipconfig`).
    * No arquivo `client/api/api.jsx`, substitua a URL base:
        ```javascript
        const BASE_URL = 'http://seu_ip_aqui:3000'; // Mude 'seu_ip_aqui' para o seu IPv4
        ```

5.  **Inicie o Servidor (Backend):**
    ```bash
    cd server
    npm start
    ```

6.  **Inicie o Aplicativo (Frontend):**
    ```bash
    cd ../client
    npx expo start
    ```
    * **Para abrir:**
        * Pressione `w` no terminal para abrir no navegador (Web).
        * Ou use o app **Expo Go** no seu celular para escanear o QR Code exibido no terminal.

---

## 🎨 Design e Protótipo

Explore o layout e o fluxo do aplicativo no Figma:

🔗 **Link do Figma:** [https://www.figma.com/design/sEJditsxUmXhEh4uYaEOvt/Smart-KiloWatch?node-id=0-1&t=DAcvqIxPUgeIEmUy-1](https://www.figma.com/design/sEJditsxUmXhEh4uYaEOvt?node-id=0-1&t=DAcvqIxPUgeIEmUy-1)

---

## 📺 Demonstração

Assista a uma breve demonstração do projeto:

🔗 **Vídeo no YouTube:** [https://www.youtube.com](https://www.youtube.com)

---

## 🤝 Contribuições

Sua colaboração é muito bem-vinda! Sinta-se à vontade para sugerir melhorias, abrir Pull Requests ou reportar bugs abrindo uma **Issue** no repositório.

---

## 🧠 Desenvolvedor

**Victor Santos dos Reis**
* **Trabalho de Conclusão de Curso – 2025**

Smart KiloWatch © Todos os direitos reservados.