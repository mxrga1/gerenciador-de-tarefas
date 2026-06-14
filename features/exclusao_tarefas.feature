# language: pt

Funcionalidade: Exclusão de tarefas

Cenário: Excluir tarefa existente
Dado que existe uma tarefa cadastrada
Quando o usuário exclui a tarefa
Então a tarefa deve ser removida da lista

Cenário: Lista permanece igual sem exclusão
Dado que existe uma tarefa cadastrada
Quando o usuário não exclui a tarefa
Então a tarefa deve permanecer na lista
