'use strict';

let tablero = document.querySelector('#tablero');
const header = document.querySelector('#header');
const divHeader = document.createElement('div');
const intentos = document.createElement('p');
const resetButton = document.createElement('button');
resetButton.textContent = 'Reiniciar';
header.appendChild(divHeader);
divHeader.appendChild(resetButton);
divHeader.appendChild(intentos);

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

    spanContador.textContent = contador;
    if (contador > 10) {
      spanContador.style.color = 'orange';
    }
    if (contador > 20) {
      spanContador.style.color = 'red';
    }

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
          showVictoryModal();
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

intentos.textContent = `Intentos: `;
const spanContador = document.createElement('span');
spanContador.id = 'span-contador';
spanContador.textContent = contador;
intentos.appendChild(spanContador);

function showVictoryModal() {
  const modalHTML = `
    <div class="modal-overlay" id="modalOverlay"></div>
    <div class="victory-modal" id="victoryModal">
      <h2>¡Felicidades!</h2>
      <p>Has encontrado todas las parejas en ${contador} intentos</p>
      <button onclick="resetGame()">Jugar de nuevo</button>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  setTimeout(() => {
    document.getElementById('modalOverlay').classList.add('show');
    document.getElementById('victoryModal').classList.add('show');
  }, 100);
}

function resetGame() {
  // Eliminar el modal si existe
  const modalOverlay = document.getElementById('modalOverlay');
  const victoryModal = document.getElementById('victoryModal');
  if (modalOverlay) modalOverlay.remove();
  if (victoryModal) victoryModal.remove();
  
  // Reiniciar el contador y su estilo
  contador = 0;
  spanContador.textContent = '0';
  spanContador.style.color = 'rgb(0, 164, 57)';
  
  // Reiniciar las cartas
  for (const card of cards) {
    card.classList.remove('flipped');
    card.classList.remove('par');
  }
  
  // Barajar y regenerar las cartas
  shuffleEmojis.sort(() => Math.random() - 0.5);
  generarCard();
  cards = document.querySelectorAll('.card');
  for (const card of cards) {
    card.addEventListener('click', reveal);
  }
}

resetButton.addEventListener('click', resetGame);
