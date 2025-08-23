'use strict';

const game = {
  // Properties
  tablero: document.querySelector('#tablero'),
  header: document.querySelector('#header'),
  divHeader: document.createElement('div'),
  intentos: document.createElement('p'),
  resetButton: document.createElement('button'),
  
  difficultyLevels: {
    easy: { 
      pairs: 4, 
      emojis: ['😵', '🥵', '🥶', '😱', '🌝', '🤑', '🤠', '🎃'] 
    },
    medium: { 
      pairs: 6, 
      emojis: ['🍎', '🍊', '🍋', '🍉', '🍇', '🍓', '🍒', '🍑', '🍍', '🥝', '🥭', '🥥'] 
    },
    hard: { 
      pairs: 8, 
      emojis: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍️', '🚨'] 
    }
  },
  currentDifficulty: 'easy', // Default difficulty

  emojis: [], // This will be set based on currentDifficulty
  shuffleEmojis: [],
  contador: 0,
  spanContador: null, // Will be created in init

  // Methods
  init: function() {
    this.resetButton.textContent = 'Reiniciar';
    this.header.appendChild(this.divHeader);
    this.divHeader.appendChild(this.resetButton);
    this.divHeader.appendChild(this.intentos);

    // Difficulty selection UI
    const difficultyDiv = document.createElement('div');
    difficultyDiv.classList.add('difficulty-selection');
    const difficultyLabel = document.createElement('span');
    difficultyLabel.textContent = 'Dificultad: ';
    difficultyDiv.appendChild(difficultyLabel);

    for (const level in this.difficultyLevels) {
      const button = document.createElement('button');
      button.textContent = level.charAt(0).toUpperCase() + level.slice(1); // Capitalize first letter
      button.classList.add('difficulty-button');
      if (level === this.currentDifficulty) {
        button.classList.add('active');
      }
      button.dataset.difficulty = level;
      button.addEventListener('click', (e) => {
        this.currentDifficulty = e.target.dataset.difficulty;
        // Update active class
        document.querySelectorAll('.difficulty-button').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.resetGame();
      });
      difficultyDiv.appendChild(button);
    }
    this.divHeader.appendChild(difficultyDiv);
    // Aplicar clase de grid inicial según dificultad
    this.applyGridClass();

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

    this.resetButton.addEventListener('click', () => this.resetGame());

    // Initial game setup
    this.resetGame(); // Call resetGame to set up the initial board based on default difficulty
  },

  generarCard: function() {
    const numPairs = this.difficultyLevels[this.currentDifficulty].pairs;
    const totalCards = numPairs * 2;
    this.emojis = this.difficultyLevels[this.currentDifficulty].emojis; // Set emojis based on difficulty

    // Ensure emojis array has enough unique emojis for the chosen difficulty
    if (this.emojis.length < numPairs) {
      console.error('Not enough unique emojis for this difficulty level!');
      // Fallback to easy or handle error
      this.currentDifficulty = 'easy';
      this.emojis = this.difficultyLevels.easy.emojis;
      const easyPairs = this.difficultyLevels.easy.pairs;
      this.shuffleEmojis = [...this.emojis.slice(0, easyPairs), ...this.emojis.slice(0, easyPairs)].sort(() => Math.random() - 0.5);
    } else {
      this.shuffleEmojis = [...this.emojis.slice(0, numPairs), ...this.emojis.slice(0, numPairs)].sort(() => Math.random() - 0.5);
    }

    const card = [];
    for (let i = 0; i < totalCards; i++) { // Use totalCards
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
          if (par.length === this.difficultyLevels[this.currentDifficulty].pairs * 2) { // Use dynamic total cards
            this.showVictoryModal();
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
        <button onclick="game.resetGame()">Jugar de nuevo</button>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    setTimeout(() => {
      document.getElementById('modalOverlay').classList.add('show');
      document.getElementById('victoryModal').classList.add('show');
    }, 100);
  },

  applyGridClass: function() {
    this.tablero.classList.remove('grid-easy', 'grid-medium', 'grid-hard');
    this.tablero.classList.add(`grid-${this.currentDifficulty}`);
  },

  resetGame: function() {
    const modalOverlay = document.getElementById('modalOverlay');
    const victoryModal = document.getElementById('victoryModal');
    if (modalOverlay) modalOverlay.remove();
    if (victoryModal) victoryModal.remove();
    // Actualizar layout del tablero según la dificultad activa
    this.applyGridClass();
    
    this.contador = 0;
    this.spanContador.textContent = '0';
    this.spanContador.classList.remove('intentos-warning', 'intentos-danger');
    
    for (const card of document.querySelectorAll('.card')) {
      card.classList.remove('flipped');
      card.classList.remove('par');
    }
    
    // Re-initialize emojis and shuffle based on current difficulty
    this.emojis = this.difficultyLevels[this.currentDifficulty].emojis;
    const numPairs = this.difficultyLevels[this.currentDifficulty].pairs;
    this.shuffleEmojis = [...this.emojis.slice(0, numPairs), ...this.emojis.slice(0, numPairs)].sort(() => Math.random() - 0.5);
    
    this.generarCard();
  }
};

game.init(); // Initialize the game