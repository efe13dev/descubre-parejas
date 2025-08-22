'use strict';

const game = {
  // Properties
  tablero: document.querySelector('#tablero'),
  header: document.querySelector('#header'),
  divHeader: document.createElement('div'),
  intentos: document.createElement('p'),
  resetButton: document.createElement('button'),
  emojis: [
    '😵', '🥵', '🥶', '😱', '🌝', '🤑', '🤠', '🎃',
    '😵', '🥵', '🥶', '😱', '🌝', '🤑', '🤠', '🎃'
  ],
  shuffleEmojis: [],
  contador: 0,
  spanContador: null, // Will be created in init

  // Methods
  init: function() {
    this.resetButton.textContent = 'Reiniciar';
    this.header.appendChild(this.divHeader);
    this.divHeader.appendChild(this.resetButton);
    this.divHeader.appendChild(this.intentos);

    this.shuffleEmojis = [...this.emojis].sort(() => Math.random() - 0.5); // Create a copy before shuffling

    this.generarCard();

    this.spanContador = document.createElement('span');
    this.spanContador.id = 'span-contador';
    this.spanContador.classList.add('intentos-base');
    this.spanContador.textContent = this.contador;
    this.intentos.textContent = `Intentos: `;
    this.intentos.appendChild(this.spanContador);

    this.tablero.addEventListener('click', (e) => {
      const clickedCard = e.target.closest('.card');
      if (clickedCard) {
        this.revealCard(clickedCard);
      }
    });

    this.resetButton.addEventListener('click', () => this.resetGame()); // Use arrow function to preserve 'this'
  },

  generarCard: function() {
    const card = [];
    for (let i = 0; i < 16; i++) {
      card.push(`
        <button type="button" class="card" aria-label="Tarjeta de juego">
          <div class="content">
            <div class="front">
            ?
            </div>
            <div class="back">${this.shuffleEmojis[i]}</div>
          </div>
        </button>       
        `);
    }
    this.tablero.innerHTML = card.join(' ');
  },

  revealCard: function(currentCard) {
    if (currentCard.classList.contains('par') || document.querySelectorAll('.flipped').length === 2) {
      return;
    }

    currentCard.classList.add('flipped');
    let flippeds = document.querySelectorAll('.flipped');

    if (flippeds.length === 2) {
      this.contador++;
      this.spanContador.textContent = this.contador;

      if (this.contador > 20) {
        this.spanContador.classList.add('intentos-danger');
        this.spanContador.classList.remove('intentos-warning');
      } else if (this.contador > 10) {
        this.spanContador.classList.add('intentos-warning');
      }

      if (
        flippeds[0].querySelector('.back').textContent ===
        flippeds[1].querySelector('.back').textContent
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
            this.showVictoryModal(); // Use this.showVictoryModal
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
  },

  showVictoryModal: function() {
    const modalHTML = `
      <div class="modal-overlay" id="modalOverlay"></div>
      <div class="victory-modal" id="victoryModal">
        <h2>¡Felicidades!</h2>
        <p>Has encontrado todas las parejas en ${this.contador} intentos</p>
        <button onclick="game.resetGame()">Jugar de nuevo</button> // Call through game object
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    setTimeout(() => {
      document.getElementById('modalOverlay').classList.add('show');
      document.getElementById('victoryModal').classList.add('show');
    }, 100);
  },

  resetGame: function() {
    const modalOverlay = document.getElementById('modalOverlay');
    const victoryModal = document.getElementById('victoryModal');
    if (modalOverlay) modalOverlay.remove();
    if (victoryModal) victoryModal.remove();
    
    this.contador = 0;
    this.spanContador.textContent = '0';
    this.spanContador.classList.remove('intentos-warning', 'intentos-danger');
    
    for (const card of document.querySelectorAll('.card')) {
      card.classList.remove('flipped');
      card.classList.remove('par');
    }
    
    this.shuffleEmojis = [...this.emojis].sort(() => Math.random() - 0.5); // Reshuffle
    this.generarCard();
  }
};

game.init(); // Initialize the game
