const NUM_ROWS = 6;
	const NUM_COLS = 7;
	const CONNECT_N = 4;
	const PLAYER1_COLOR = "red";
	const PLAYER2_COLOR = "yellow";
	const EMPTY_CELL = "";

	let juego = null; // Initialize juego to null
	let scoreJug1Num = 0;
	let scoreJug2Num = 0;

	const GameUI = {
		updateTurnIndicator: function(playerName) {
			document.getElementById("turnoJug").textContent = playerName;
		},
		updatePlayerScores: function(score1, score2) {
			document.getElementById("scoreJug1").textContent = score1;
			document.getElementById("scoreJug2").textContent = score2;
		},
		setPlayerNamesInUI: function(name1, name2) {
			document.getElementById("jugador1h3").textContent = name1;
			document.getElementById("jugador2h3").textContent = name2;
		},
		showAlert: function(message) {
			alert(message);
		},
		showConfirmation: function(message) {
			return confirm(message);
		},
		showPlayerNameForm: function() {
			document.getElementById("formNombresJug").style.display = "inherit";
		},
		hidePlayerNameForm: function() {
			document.getElementById("formNombresJug").style.display = "none";
		},
		showGameBoard: function() {
			document.getElementById("divPrincipal").style.display = "inherit";
		},
		hideGameBoard: function() {
			document.getElementById("divPrincipal").style.display = "none";
		},
		showStartButton: function() {
			document.getElementById("comenzarButton").style.display = "block";
		},
		hideStartButton: function() {
			document.getElementById("comenzarButton").style.display = "none";
		},
		disableBoardClicks: function() {
			for (let i = 0; i < elementosTd.length; i++) {
				elementosTd[i].onclick = null;
			}
		},
		enableBoardClicks: function() {
			for (let i = 0; i < elementosTd.length; i++) {
				elementosTd[i].onclick = celdaPulsada; // celdaPulsada is global
			}
		}
	};
	
	const elementosTd = document.getElementsByTagName("td");
	for (let i = 0; i < elementosTd.length; i++) {
		elementosTd[i].onclick = celdaPulsada;
	}

	// FUNCIÓN 1. Oculta botón comenzar y muestra formulario.
	function formJugs() {
		GameUI.hideStartButton();
		GameUI.showPlayerNameForm();
	}
	
	// FUNCIÓN 2. Oculta formulario y muestra marcador y tablero.
	function comprobarFormJugs() {
		const jug1 = document.getElementById("nombreJug1").value.toUpperCase();
		const jug2 = document.getElementById("nombreJug2").value.toUpperCase(); // OBTENEMOS VALORES DE LOS NOMBRES DE JUGADORES

		if (jug1 !== "" && jug2 !== "") {
			GameUI.setPlayerNamesInUI(jug1, jug2);
			
			GameUI.hidePlayerNameForm();
			GameUI.showGameBoard();
			
			scoreJug1Num = 0; // Initialize scores
			scoreJug2Num = 0;
			GameUI.updatePlayerScores(scoreJug1Num, scoreJug2Num);

			let turno;
			if (Math.random() < 0.5) { // Simplified 50/50 chance
				turno = jug1;
			} else {
				turno = jug2;
			} // Jug1 o Jug2 aleatorio.
			
			GameUI.updateTurnIndicator(turno);
			
			juego = new Tablero(turno, jug1, jug2); // Create instance of Tablero class
			renderBoard(juego.arrayBidimensional); // Initial render of the empty board
		} else {
			GameUI.showAlert("ERROR. Debe indicar un nombre por cada jugador.");
		}
	}	

	// Nueva función para renderizar el tablero
	function renderBoard(boardState) {
		for (let i = 0; i < NUM_ROWS; i++) {
			for (let j = 0; j < NUM_COLS; j++) {
				const cellId = i + "" + j;
				const cellElement = document.getElementById(cellId);
				if (cellElement) {
					// Reset classes first
					cellElement.classList.remove('empty-slot', 'player1-token', 'player2-token');

					if (boardState[i][j] === PLAYER1_COLOR) { // State value 'red'
						cellElement.classList.add('player1-token');
					} else if (boardState[i][j] === PLAYER2_COLOR) { // State value 'yellow'
						cellElement.classList.add('player2-token');
					} else { // EMPTY_CELL (state value '')
						cellElement.classList.add('empty-slot');
					}
				}
			}
		}
	}
		
	function celdaPulsada() {
		const celda = this.id;
		// El segundo carácter del ID de la celda (ej: "01", "12") es el índice de la columna.
		const columna = celda.charAt(1); 
		if (juego) {
			juego.comprobarColumna(columna);
		}
	} // Coger id de la celda pulsada y sacar la columna.
	

	// CLASE TABLERO.
	class Tablero {
		constructor(jugador, nombreJug1, nombreJug2) {
			// Initialize arrayBidimensional dynamically
			this.arrayBidimensional = [];
			for (let i = 0; i < NUM_ROWS; i++) {
				this.arrayBidimensional[i] = new Array(NUM_COLS).fill(EMPTY_CELL);
			}
			this.jugador = jugador; // Current player
			this.j1 = nombreJug1;    // Name of player 1
			this.j2 = nombreJug2;    // Name of player 2
			this.rechazoReiniciar = false; // Moved from global scope
		}

		// Comprobar la columna para ver si está llena.
		comprobarColumna(columnaPulsada) {
			if (this.arrayBidimensional[0][columnaPulsada] === EMPTY_CELL) {
				this.actualizarMatriz(columnaPulsada); // Update internal state
				renderBoard(this.arrayBidimensional);   // Render the updated board
				
				const gameStatus = this.comprobarTablero(); // Check for game end, switch turns etc.

				if (gameStatus.status === 'win') {
					GameUI.showAlert("Enhorabuena " + gameStatus.winner + ", has ganado!!");
					if (gameStatus.winner === this.j1) {
						scoreJug1Num++;
					} else if (gameStatus.winner === this.j2) {
						scoreJug2Num++;
					}
					GameUI.updatePlayerScores(scoreJug1Num, scoreJug2Num);
					
					const nuevoJuegoResult = this.nuevoJuego();
					if (nuevoJuegoResult.startNew) {
						GameUI.updateTurnIndicator(nuevoJuegoResult.startingPlayer);
						renderBoard(this.arrayBidimensional); // Render the cleared board
					} else {
						juego = null; // Game ends, no new game
					}
				} else if (gameStatus.status === 'tie') {
					GameUI.showAlert("EMPATE!!!");
					const nuevoJuegoResult = this.nuevoJuego();
					if (nuevoJuegoResult.startNew) {
						GameUI.updateTurnIndicator(nuevoJuegoResult.startingPlayer);
						renderBoard(this.arrayBidimensional); // Render the cleared board
					} else {
						juego = null; // Game ends, no new game
					}
				} else if (gameStatus.status === 'continue') {
					GameUI.updateTurnIndicator(gameStatus.nextPlayer);
				}
			} else {
				GameUI.showAlert("Columna llena. Prueba con otra columna.");
			}
		}

		// Actualizar la matriz.
		actualizarMatriz(columnaPulsada) {
			let actualizada = false;
			const totalFilas = NUM_ROWS - 1; 
			for (let i = totalFilas; i >= 0; i--) {
				if (actualizada === false) {
					if (this.arrayBidimensional[i][columnaPulsada] === EMPTY_CELL) {
						if (this.jugador === this.j1) {
							this.arrayBidimensional[i][columnaPulsada] = PLAYER1_COLOR;	
						} else {
							this.arrayBidimensional[i][columnaPulsada] = PLAYER2_COLOR;	
						}
						actualizada = true;
						// No longer calls colorearTablero or comprobarTablero here
					}
				}
			}
		}
		
		// Colorear el tablero según la matriz. -- METHOD REMOVED
		
		// Comprobar si se ha ganado o si está lleno.
		comprobarTablero() {
			let fin = false;
			// let ganador; // Not used, current player this.jugador is used
			// let contador = 1; // Not used for win condition check
			
			// COMPROBAR VERTICAL
			for (let i = 0; i <= NUM_ROWS - CONNECT_N; i++) { 
				for (let j = 0; j < NUM_COLS; j++) {
					if (this.arrayBidimensional[i][j] !== EMPTY_CELL &&
						this.arrayBidimensional[i][j] === this.arrayBidimensional[i+1][j] &&
						this.arrayBidimensional[i][j] === this.arrayBidimensional[i+2][j] &&
						this.arrayBidimensional[i][j] === this.arrayBidimensional[i+3][j]) {
						fin = true;
					}
				}
			}
			
			// COMPROBAR HORIZONTAL
			for (let i = 0; i < NUM_ROWS; i++) {
				for (let j = 0; j <= NUM_COLS - CONNECT_N; j++) { 
					if (this.arrayBidimensional[i][j] !== EMPTY_CELL &&
						this.arrayBidimensional[i][j] === this.arrayBidimensional[i][j+1] &&
						this.arrayBidimensional[i][j] === this.arrayBidimensional[i][j+2] &&
						this.arrayBidimensional[i][j] === this.arrayBidimensional[i][j+3]) {
						fin = true;
					}
				}
			}
			
			// COMPROBAR DIAGONAL (DESCENDENTE \ )
			for (let i = 0; i <= NUM_ROWS - CONNECT_N; i++) { 
				for (let j = 0; j <= NUM_COLS - CONNECT_N; j++) { 
					if (this.arrayBidimensional[i][j] !== EMPTY_CELL &&
						this.arrayBidimensional[i][j] === this.arrayBidimensional[i+1][j+1] &&
						this.arrayBidimensional[i][j] === this.arrayBidimensional[i+2][j+2] &&
						this.arrayBidimensional[i][j] === this.arrayBidimensional[i+3][j+3]) {
						fin = true;
					}
				}
			}
			
			// COMPROBAR DIAGONAL INVERSA (ASCENDENTE / )
			for (let i = CONNECT_N - 1; i < NUM_ROWS; i++) { 
				for (let j = 0; j <= NUM_COLS - CONNECT_N; j++) { 
					if (this.arrayBidimensional[i][j] !== EMPTY_CELL &&
						this.arrayBidimensional[i][j] === this.arrayBidimensional[i-1][j+1] &&
						this.arrayBidimensional[i][j] === this.arrayBidimensional[i-2][j+2] &&
						this.arrayBidimensional[i][j] === this.arrayBidimensional[i-3][j+3]) {
						fin = true;
					}
				}
			}
			
			// COMPROBAR SI ESTÁ LLENO (EMPATE)
			let esEmpate = false;
			if (!fin) { // Only check for empate if no winner yet
				let contadorCeldasLlenas = 0;
				for (let i = 0; i < NUM_ROWS; i++) {
					for (let j = 0; j < NUM_COLS; j++) {
						if (this.arrayBidimensional[i][j] !== EMPTY_CELL) {
							contadorCeldasLlenas++;
						}
					}
				}
				if (contadorCeldasLlenas === (NUM_ROWS * NUM_COLS)) { 
					fin = true;
					esEmpate = true;
					// this.jugador = "empate"; // Winner will be set to 'empate'
				}
			}
			
			if (fin) {
				if (esEmpate) {
					return { status: 'tie', winner: 'empate' };
				} else {
					// 'this.jugador' currently holds the player who made the last move, thus the winner.
					return { status: 'win', winner: this.jugador };
				}
			} else {
				const nextPlayerName = this.siguienteTurno(); // Update internal player and get next
				return { status: 'continue', nextPlayer: nextPlayerName };
			}
		}
		
		// Actualizar turno si no ha terminado el juego.
		// Now only updates internal state and returns the next player.
		siguienteTurno() {
			if (this.jugador === this.j1) {
				this.jugador = this.j2;
			} else {
				this.jugador = this.j1;
			}
			return this.jugador; // Return the name of the next player
		}

		// Actualizar el marcador subiendo un punto al ganador. -- METHOD REMOVED
		// This logic will be handled by comprobarColumna using GameUI and global score variables.
	
		// Preguntar si vaciar el tablero para comenzar un nuevo juego.
		nuevoJuego() {
			if (GameUI.showConfirmation("¿Quiere volver a jugar?")) {
				// Determine next starting player
				if (this.jugador === this.j1 || this.jugador === "empate") { 
					this.jugador = this.j2;
				} else { 
					this.jugador = this.j1;
				}
				// GameUI.updateTurnIndicator(this.jugador); // This will be handled by the caller

				// Reset internal board state
				this.arrayBidimensional = [];
				for (let i = 0; i < NUM_ROWS; i++) {
					this.arrayBidimensional[i] = new Array(NUM_COLS).fill(EMPTY_CELL);
				}
				// renderBoard(this.arrayBidimensional); // Caller will handle rendering

				this.rechazoReiniciar = false;
				GameUI.enableBoardClicks();
				
				return { 
					startNew: true, 
					startingPlayer: this.jugador,
					player1Name: this.j1, // Pass player names back for context if needed
					player2Name: this.j2
				};
			} else {
				GameUI.showAlert("GRACIAS POR JUGAR!!!");
				this.rechazoReiniciar = true;
				GameUI.disableBoardClicks();
				GameUI.showStartButton();
				GameUI.hideGameBoard();
				// juego = null; // Caller (comprobarColumna) should handle setting global 'juego' to null
				return { startNew: false };
			}	
		}
	}
