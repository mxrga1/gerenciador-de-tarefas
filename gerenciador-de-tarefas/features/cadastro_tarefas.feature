# language: pt

Funcionalidade: Cadastro de tarefas
  Como usuário do gerenciador de tarefas
  Quero criar uma nova tarefa informando um título
  Para organizar minhas atividades em uma lista de tarefas

  Cenário: Criar tarefa com título válido
    Dado que o usuário está cadastrando uma tarefa
    Quando ele informa o título "Estudar JavaScript"
    E salva a tarefa
    Então a tarefa "Estudar JavaScript" deve ser adicionada à lista

  Cenário: Tentar criar tarefa sem título
    Dado que o usuário está cadastrando uma tarefa
    Quando ele não informa o título
    E tenta salvar a tarefa
    Então nenhuma tarefa deve ser adicionada à lista
