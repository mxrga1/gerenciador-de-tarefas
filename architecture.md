# Arquitetura do Sistema

## Visão Geral
O Gerenciador de Tarefas é uma aplicação web simples que roda diretamente no navegador.

A aplicação permite criar, visualizar, editar e excluir tarefas, armazenando os dados localmente no navegador usando localStorage.

---

## Tecnologias Utilizadas

- Frontend: HTML, CSS e JavaScript
- Armazenamento: localStorage (Inicialmente)

---

## Estrutura do Sistema

O sistema é composto por 3 partes principais:

### 1. Interface (Frontend)
Responsável pela interação com o usuário.

- Formulário para criar tarefas
- Lista de tarefas
- Botões de editar, excluir e concluir

---

### 2. Lógica (JavaScript)
Responsável pelo funcionamento do sistema.

Principais funções:

- criarTarefa()
- listarTarefas()
- editarTarefa()
- excluirTarefa()
- marcarConcluida()

---

### 3. Armazenamento (localStorage)
Responsável por salvar os dados no navegador.

Exemplo de estrutura:

```json
[
  {
    "id": 1,
    "titulo": "Estudar para prova",
    "concluida": false,
    "prazo": "2026-03-20"
  }
]
