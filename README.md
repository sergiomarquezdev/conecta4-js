# Connect 4 Game

## Descripción Corta
Un clásico juego de Conecta 4 implementado con HTML, CSS y JavaScript puro, utilizando las librerías Bootstrap y jQuery para algunos componentes y funcionalidades. ¡El objetivo es alinear cuatro de tus fichas antes que tu oponente!

## Características Principales
*   Juego para dos jugadores.
*   Nombres de jugadores personalizables.
*   Turnos alternados entre jugadores.
*   Indicador visual del jugador actual.
*   Detección de victoria en horizontal, vertical y ambas diagonales.
*   Detección de empate si el tablero se llena.
*   Marcador de puntuación para seguir las victorias de cada jugador.
*   Opción para jugar una nueva partida después de que una termina.
*   Diseño responsivo gracias a Bootstrap (aunque las mejoras de estilo recientes se centraron en la apariencia del tablero).
*   Interfaz de usuario mejorada con estilos modernos para el tablero y las fichas.

## Tecnologías Utilizadas
*   **HTML5:** Para la estructura básica de la página y el juego.
*   **CSS3:** Para los estilos visuales, incluyendo el diseño del tablero, las fichas y la página en general.
    *   **Bootstrap:** Utilizado para el layout general y algunos componentes de la interfaz de usuario (como las alertas).
*   **JavaScript (ES6+):** Para toda la lógica del juego, manejo de turnos, detección de victorias, y manipulación del DOM.
    *   **jQuery:** Incluido en el proyecto, aunque gran parte de la lógica del juego reciente se ha implementado con JavaScript puro.

## Cómo Jugar
1.  Al abrir la página, haz clic en el botón "COMENZAR!!!".
2.  Introduce el nombre para el Jugador 1 y el Jugador 2 en el formulario que aparece.
3.  Haz clic en el botón "JUGAR!!!".
4.  El juego determinará aleatoriamente quién comienza. El turno del jugador actual se mostrará en pantalla.
5.  Haz clic en la columna del tablero donde deseas dejar caer tu ficha.
6.  El objetivo es ser el primero en alinear cuatro fichas de tu color (rojo para Jugador 1, amarillo para Jugador 2) de forma consecutiva, ya sea horizontal, vertical o diagonalmente.
7.  Si el tablero se llena y nadie ha conseguido alinear cuatro fichas, la partida termina en empate.
8.  Después de cada partida (victoria o empate), se te preguntará si deseas volver a jugar.

## Estructura del Proyecto
```
.
├── index.html             # Archivo principal HTML con la estructura del juego.
├── js/
│   └── conecta4.js        # Contiene toda la lógica JavaScript del juego.
├── estilos/
│   └── estilos.css        # Hoja de estilos principal para el juego.
├── librerias/               # Contiene las librerías de terceros.
│   ├── bootstrap/         # Archivos de Bootstrap (CSS y JS).
│   └── jquery/            # Archivos de jQuery.
└── README.md              # Este archivo.
```

## Autor
*   **Sergio Márquez @ smarquezp05** (Creador original del proyecto)
*   Mejoras de estructura y estilo realizadas por Jules (Agente IA de Google).
