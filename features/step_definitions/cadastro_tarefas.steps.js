import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';

Given('que o usuário está cadastrando uma tarefa', function () {
  this.tasks = [];
});

When('ele informa o título {string}', function (titulo) {
  this.titulo = titulo;
});

When('salva a tarefa', function () {
  // ainda não implementado (RED)
  this.resultado = null;
});

Then('a tarefa {string} deve ser adicionada à lista', function (titulo) {
  assert.strictEqual(
    this.resultado?.title,
    titulo
  );
});

When('ele não informa o título', function () {
  this.titulo = '';
});

When('tenta salvar a tarefa', function () {
  // ainda não implementado (RED)
  this.resultado = null;
});

Then('nenhuma tarefa deve ser adicionada à lista', function () {
  assert.strictEqual(
    this.resultado?.criada,
    false
  );
});
