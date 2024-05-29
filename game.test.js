/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

let currentPlayer;
let buttons;
let positions;
let init;
let newMove;
let check;

beforeEach(() => {
  document.documentElement.innerHTML = html.toString();
  currentPlayer = document.querySelector('.currentPlayer');
  buttons = document.querySelectorAll('.game button');
  positions = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];

  selected = [];
  player = 'X';

  // Define the functions
  init = function() {
    selected = [];

    currentPlayer.innerHTML = `JOGADOR DA VEZ: ${player}`;

    buttons.forEach((item) => {
      item.innerHTML = '';
      item.addEventListener('click', newMove);
    });
  };

  newMove = function(e) {
    const index = e.target.getAttribute('data-i');
    e.target.innerHTML = player;
    e.target.removeEventListener('click', newMove);
    selected[index] = player;

    setTimeout(() => {
      check();
    }, [100]);

    player = player === 'X' ? 'O' : 'X';
    currentPlayer.innerHTML = `JOGADOR DA VEZ: ${player}`;
  };

  check = function() {
    let playerLastMove = player === 'X' ? 'O' : 'X';

    const items = selected
      .map((item, i) => [item, i])
      .filter((item) => item[0] === playerLastMove)
      .map((item) => item[1]);

    for (pos of positions) {
      if (pos.every((item) => items.includes(item))) {
        alert("O JOGADOR '" + playerLastMove + "' GANHOU!");
        init();
        return;
      }
    }

    if (selected.filter((item) => item).length === 9) {
      alert('DEU EMPATE!');
      init();
      return;
    }
  };

  // Initialize the game
  init();
});

test('Inicializa o jogo corretamente (função init)', () => {
  buttons.forEach((button) => {
    expect(button.innerHTML).toBe('');
  });
  expect(currentPlayer.innerHTML).toBe('JOGADOR DA VEZ: X');
});

test('O jogador pode fazer um movimento (função newMove)', () => {
  buttons[0].click();
  expect(buttons[0].innerHTML).toBe('X');
  expect(currentPlayer.innerHTML).toBe('JOGADOR DA VEZ: O');
});

test('Botão não pode ser clicado duas vezes (teste de integração entre interface e lógica do jogo)', () => {
  buttons[0].click();
  buttons[0].click();
  expect(buttons[0].innerHTML).toBe('X'); // still X
});
