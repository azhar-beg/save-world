const randomInt = max => Math.floor(Math.random() * max);

const uniq = elements => {
  return elements.reduce((unique, element) => {
    if (!unique.includes(element)) {
      unique.push(element);
    }
    return unique;
  }, []);
};

const randomNumbers = (total) => {
  const numbers = Array(total * 3).fill(1).map(() => randomInt(100))
  return uniq(numbers).slice(0, 21);
};

const sortNum = numbers => {
  return numbers.sort((a, b) => {
    return a - b;
  });
};

const tracker = (board, playGame, game, time) => {
  let seconds = time;
  const timer = document.getElementById('timer');
  const id = setInterval(() => {
    timer.innerText = seconds--;
    if (game.isOver()) {
      clearInterval(id);
    }

    if (seconds === -1) {
      clearInterval(id);
      board.removeEventListener('click', playGame);
      const result = document.getElementById('result')
      result.innerText = 'Oops...out of time...!'
    }
  }, 1000);
  return id;
};

class Game {
  #numbers;
  #index;
  #moves;
  constructor(numbers) {
    this.#numbers = numbers;
    this.#index = -1;
    this.#moves = [];
  }

  isMoveValid() {
    return this.#numbers[this.#index] === this.#moves[this.#index];
  }

  makeMove(move) {
    this.#index++;
    this.#moves.push(move);
  }

  isOver() {
    return (this.#index >= 0) && (!this.isMoveValid() || this.hasWon());
  }

  hasWon() {
    return this.#numbers.length === this.#moves.length;
  }
}

const presentBoard = (numbers) => {
  numbers.forEach(number => {
    tag = document.createElement('div');
    tag.className = 'number';
    const text = document.createTextNode(number);
    tag.appendChild(text);

    const element = document.getElementById('board');
    element.appendChild(tag);
  });
};

const updateBoard = (game, cell, result) => {
  if (game.isMoveValid()) {
    cell.style.backgroundColor = 'green';

    if (game.hasWon()) {
      result.innerText = 'Yay...! You just saved the world...'
    }
    return;
  }
  cell.style.backgroundColor = 'red';
  result.innerText = 'Oops...Better Luck Next Time...!'
};

const startGame = (event, game) => {
  const result = document.getElementById('result')
  const cell = event.target;

  if (cell.className !== 'number') {
    return;
  }

  if (game.isOver()) {
    result.innerText = 'restart game...'
    return;
  }

  const move = +cell.innerText
  game.makeMove(move);

  updateBoard(game, cell, result)
};

const main = function () {
  const numbers = randomNumbers(21);
  presentBoard(numbers);
  let time = 59;
  const game = new Game(sortNum(numbers));
  const board = document.getElementById('board');
  const playGame = (event) => startGame(event, game);

  tracker(board, playGame, game, time);

  board.addEventListener('click', playGame);
};

window.onload = main
