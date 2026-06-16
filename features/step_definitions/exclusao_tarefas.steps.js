import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';

Given('que existe uma tarefa cadastrada', function () {
  this.tarefa = {
    titulo: 'Teste'
  };
});

When('o usuário exclui a tarefa', function () {
  this.tarefa = null;
});

Then('a tarefa deve ser removida da lista', function () {
  assert.strictEqual(this.tarefa, null);
});

When('o usuário não exclui a tarefa', function () {
  // mantém a tarefa
});

Then('a tarefa deve permanecer na lista', function () {
  assert.notStrictEqual(this.tarefa, null);
});
