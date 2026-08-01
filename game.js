const canvas = document.getElementById( 'game' );
const ctx = canvas.getContext( '2d' );

const state = {
  screen: 'START', // 'START' | 'PLAYING' | 'GAME_OVER' | 'VICTORY'
  score: 0,
  lives: 3,
  blocks: [],
};

const paddle = {
  x: 195, y: 570, w: 90, h: 14, speed: 6,
};

const keys = {};

function movePaddle() {
  if ( ( keys[ 'ArrowLeft' ] || keys[ 'a' ] || keys[ 'A' ] ) ) {
    paddle.x -= paddle.speed;
  }
  if ( ( keys[ 'ArrowRight' ] || keys[ 'd' ] || keys[ 'D' ] ) ) {
    paddle.x += paddle.speed;
  }
  if ( paddle.x < 0 ) paddle.x = 0;
  if ( paddle.x + paddle.w > canvas.width ) paddle.x = canvas.width - paddle.w;
}

function drawPlayingScreen() {
  ctx.fillStyle = '#000';
  ctx.fillRect( 0, 0, canvas.width, canvas.height );
  movePaddle();
  drawSprite( ctx, 'paddle', paddle.x, paddle.y, paddle.w, paddle.h );
}

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
  } else if ( state.screen === 'PLAYING' ) {
    drawPlayingScreen();
  }
}

function loop() {
  update();
  requestAnimationFrame( loop );
}

window.addEventListener( 'keydown', ( e ) => {
  keys[ e.key ] = true;
  if ( state.screen === 'START' ) {
    state.screen = 'PLAYING';
  }
} );

window.addEventListener( 'keyup', ( e ) => {
  keys[ e.key ] = false;
} );

loadSpritesheet( () => {
  loop();
} );
