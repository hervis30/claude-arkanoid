const canvas = document.getElementById( 'game' );
const ctx = canvas.getContext( '2d' );

const state = {
  screen: 'START', // 'START' | 'PLAYING' | 'GAME_OVER' | 'VICTORY'
  score: 0,
  lives: 3,
  blocks: [],
};

function drawStartScreen() {
  ctx.fillStyle = '#000';
  ctx.fillRect( 0, 0, canvas.width, canvas.height );
  ctx.fillStyle = '#fff';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText( 'Pulsa una tecla para empezar', canvas.width / 2, canvas.height / 2 );
}

function update() {
  if ( state.screen === 'START' ) {
    drawStartScreen();
  }
}

function loop() {
  update();
  requestAnimationFrame( loop );
}

window.addEventListener( 'keydown', () => {
  if ( state.screen === 'START' ) {
    state.screen = 'PLAYING';
  }
} );

loadSpritesheet( () => {
  loop();
} );
