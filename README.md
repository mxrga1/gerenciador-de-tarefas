# Gerenciador de Tarefas

## Integrantes
- Vinicius  
- Melissa  
- Sergio  
- André  
- Paulo  

## Descrição
Aplicação web para organização de tarefas diárias. Permite criar, editar, excluir e acompanhar tarefas de forma simples e eficiente.

## Objetivo
Facilitar o gerenciamento de tarefas pessoais ou em equipe, aumentando a produtividade.

## Tecnologias
- HTML  
- CSS  
- JavaScript  
- React (Vite)  
- localStorage  
- GitHub  

## Funcionalidades
- Criar tarefas  
- Editar tarefas  
- Excluir tarefas  
- Alterar status  
- Persistência com localStorage  

## Estrutura
```bash
src/
 └── pages/
     └── Home/
         ├── index.jsx
         ├── style.js
         └── useTasks.js
Controle de Versão

Uso de Git e GitHub com commits organizados e utilização de branches.

Sprint 1
Definição do projeto
Criação do repositório
Documentação inicial
Organização da equipe


Sprint 2
Funcionalidades entregues
CRUD de tarefas completo
Persistência de dados com localStorage
Testes
Não foram implementados testes automatizados
Cobertura atual: 0%
Foram realizados testes manuais para validação do sistema, incluindo:
- Navegação
- Funcionalidades principais
- Persistência de dados (localStorage)
Resultado: funcionamento conforme esperado.
Ajustes
Migração de JavaScript para React
Melhor organização do código


Sprint 3 (Planejamento)
Objetivos
Finalizar o sistema
Melhorar qualidade do código
Preparar apresentação
Próximos passos
Implementar testes automatizados
Melhorar interface
Validar dados de entrada
Refatorar código
Repositório

https://github.com/mxrga1/gerenciador-de-tarefas

Como executar
git clone https://github.com/mxrga1/gerenciador-de-tarefas
cd gerenciador-de-tarefas
npm install
npm run dev

## Testes realizados por Melissa

- Teste de navegação: OK  
- Teste das funcionalidades principais: OK  
- Execução do projeto: funcionando corretamente  

Sistema validado com sucesso.


## Testes realizados por André
- Teste de navegação: OK  
- Teste das funcionalidades principais: OK  
- Execução do projeto: funcionando corretamente  

Sistema validado com sucesso.

## BDD (Behavior Driven Development)

Para complementar os testes automatizados já implementados no projeto, foi aplicada a técnica BDD (Behavior Driven Development) na funcionalidade de cadastro de tarefas.

### User Story

- Como usuário do gerenciador de tarefas

- Quero criar uma nova tarefa informando um título

- Para organizar minhas atividades em uma lista de tarefas

### Cenários Implementados

#### Cenário: Criar tarefa com título válido

- Dado que o usuário está cadastrando uma tarefa

- Quando ele informa o título "Estudar JavaScript"

- E salva a tarefa

- Então a tarefa "Estudar JavaScript" deve ser adicionada à lista

#### Cenário: Tentar criar tarefa sem título

- Dado que o usuário está cadastrando uma tarefa

- Quando ele não informa o título

- E tenta salvar a tarefa

- Então nenhuma tarefa deve ser adicionada à lista

### Arquivos

- `features/cadastro_tarefas.feature`
- `features/step_definitions/cadastro_tarefas.steps.js`
