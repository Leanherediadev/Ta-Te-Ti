// ==================== CONSTANTS ==================== //
const STATUS_DISPLAY = document.querySelector('.game-notification'),
  GAME_STATE = ["", "", "", "", "", "", "", "", ""],
  WINNINGS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ],
  WIN_MESSAGE = () => `El jugador ${currentPlayer} ha ganado!`,
  DRAW_MESSAGE = () => `El juego ha terminado en empate!`;

// ==================== VARIABLES ==================== //
let gameActive = true,
    currentPlayer = "X",
    isPlayerVsAI = true; // por defecto

// ==================== FUNCTIONS ==================== //
function main() {
  // Detectar cambio de modo de juego
  const modeSelect = document.getElementById('mode-select');
  modeSelect.addEventListener('change', () => {
    isPlayerVsAI = modeSelect.value === "pve";
    handleRestartGame(); // Reinicia el juego al cambiar de modo
  });

  updateTurnDisplay();
  listeners();
}

function listeners() {
  document.querySelector('.game-container').addEventListener('click', handleCellClick);
  document.querySelector('.game-restart').addEventListener('click', handleRestartGame);
}

function updateTurnDisplay() {
  const playerSpan = document.querySelector('.current-player');
  if (currentPlayer === "O" && isPlayerVsAI) {
    playerSpan.textContent = "IA (O)";
    playerSpan.classList.add('ai');
  } else {
    playerSpan.textContent = currentPlayer;
    playerSpan.classList.remove('ai');
  }
}

function handleRestartGame() {
  gameActive = true;
  currentPlayer = "X";
  restartGameState();
  document.querySelectorAll('.game-cell').forEach(cell => cell.innerHTML = "");
  updateTurnDisplay();
}

function handleCellClick(e) {
  const clickedCell = e.target;
  if (!clickedCell.classList.contains('game-cell')) return;

  const clickedCellIndex = Array.from(clickedCell.parentNode.children).indexOf(clickedCell);
  if (GAME_STATE[clickedCellIndex] !== '' || !gameActive) return;

  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();

  if (gameActive && isPlayerVsAI && currentPlayer === "O") {
    handleAITurn();
  }
}

function handleCellPlayed(cell, index) {
  GAME_STATE[index] = currentPlayer;
  cell.innerHTML = currentPlayer;
}

function handleResultValidation() {
  let roundWon = false;
  for (let i = 0; i < WINNINGS.length; i++) {
    const [a, b, c] = WINNINGS[i];
    if (GAME_STATE[a] && GAME_STATE[a] === GAME_STATE[b] && GAME_STATE[a] === GAME_STATE[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    alert(WIN_MESSAGE());
    gameActive = false;
    return;
  }

  if (!GAME_STATE.includes("")) {
    alert(DRAW_MESSAGE());
    gameActive = false;
    return;
  }

  handlePlayerChange();
}

function handlePlayerChange() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTurnDisplay();
}

function restartGameState() {
  for (let i = 0; i < GAME_STATE.length; i++) GAME_STATE[i] = '';
}

// ==================== AI FUNCTIONS ==================== //
function handleAITurn() {
  setTimeout(() => {
    const index = bestMoveForAI();
    if (index !== null) {
      const cell = document.querySelectorAll('.game-cell')[index];
      handleCellPlayed(cell, index);
      handleResultValidation();
    }
  }, 500);
}

// IA mejorada: gana o bloquea
function bestMoveForAI() {
  // 1. Ver si puede ganar
  for (let i = 0; i < WINNINGS.length; i++) {
    const [a, b, c] = WINNINGS[i];
    const line = [GAME_STATE[a], GAME_STATE[b], GAME_STATE[c]];
    if (line.filter(v => v === "O").length === 2 && line.includes("")) {
      return [a, b, c][line.indexOf("")];
    }
  }

  // 2. Bloquear al jugador
  for (let i = 0; i < WINNINGS.length; i++) {
    const [a, b, c] = WINNINGS[i];
    const line = [GAME_STATE[a], GAME_STATE[b], GAME_STATE[c]];
    if (line.filter(v => v === "X").length === 2 && line.includes("")) {
      return [a, b, c][line.indexOf("")];
    }
  }

  // 3. Elegir centro si está libre
  if (GAME_STATE[4] === "") return 4;

  // 4. Elegir esquina libre
  const corners = [0, 2, 6, 8].filter(i => GAME_STATE[i] === "");
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

  // 5. Elegir cualquier celda libre
  const emptyIndices = GAME_STATE.map((v, idx) => v === "" ? idx : null).filter(v => v !== null);
  return emptyIndices.length > 0 ? emptyIndices[Math.floor(Math.random() * emptyIndices.length)] : null;
}

// ==================== START GAME ==================== //
main();
