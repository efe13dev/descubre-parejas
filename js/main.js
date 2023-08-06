'use strict';

let tablero = document.querySelector('#tablero');
const emojis = [
  '😵',
  '🥵',
  '🥶',
  '😱',
  '🌝',
  '🤑',
  '🤠',
  '🎃',
  '😵',
  '🥵',
  '🥶',
  '😱',
  '🌝',
  '🤑',
  '🤠',
  '🎃'
];
//En la variable shuffleEmojis guardamos el array pero desordenado cada vez que recargamos la pagina.
const shuffleEmojis = emojis.sort(function () {
  return Math.random() - 0.5;
});
console.log(shuffleEmojis);

function generarCard() {
  const card = [];
  for (let i = 0; i < 16; i++) {
    card.push(`
      <section class="card">
        <div class="content">
          <div class="front">
          ?
          </div>
          <div class="back">${shuffleEmojis[i]}</div>
        </div>
      </section>       
      `);
  }

  tablero.innerHTML = card.join(' ');
}

generarCard();
let cards = document.querySelectorAll('.card');
let contador = 0;
const reveal = (e) => {
  const currentCard = e.currentTarget;

  currentCard.classList.add('flipped');
  let flippeds = document.querySelectorAll('.flipped');

  if (flippeds.length === 2) {
    contador++;
    if (
      flippeds[0].childNodes[1].childNodes[3].textContent ===
      flippeds[1].childNodes[1].childNodes[3].textContent
    ) {
      flippeds[0].classList.add('par');
      flippeds[1].classList.add('par');
      console.log('Pareja correcta');
      setTimeout(() => {
        for (const flipped of flippeds) {
          flipped.classList.remove('flipped');
        }
      }, 1000);
      let par = document.querySelectorAll('.par');

      setTimeout(() => {
        if (par.length === 16) {
          if (
            confirm(
              `Has terminado el juego tu puntuacion es ${contador}, ¿quieres volver a jugar?`
            )
          ) {
            for (const classPar of par) {
              classPar.classList.remove('par');
            }
          }
        }
      }, 1000);
    } else {
      setTimeout(() => {
        for (const flipped of flippeds) {
          flipped.classList.remove('flipped');
        }
      }, 1000);
    }
  }
};

for (const card of cards) {
  card.addEventListener('click', reveal);
}
