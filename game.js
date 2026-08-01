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

const ball = {
  x: 240, y: 560, radius: 8,
  vx: 3, vy: -3,
};

const keys = {};

const BLOCK_COLS = 8;
const BLOCK_ROWS = 6;
const BLOCK_W = 56;
const BLOCK_H = 20;
const BLOCK_TOP_MARGIN = 40;
const BLOCK_LEFT_MARGIN = ( canvas.width - BLOCK_COLS * BLOCK_W ) / 2;

const ROW_COLORS = [ 'red', 'hotpink', 'magenta', 'yellow', 'green', 'cyan' ];

const POINTS_BY_COLOR = {
  gray: 10, cyan: 20, green: 30, yellow: 40, magenta: 50, hotpink: 60, red: 70,
};

function createBlocks() {
  const blocks = [];
  for ( let row = 0; row < BLOCK_ROWS; row++ ) {
    const color = ROW_COLORS[ row ];
    for ( let col = 0; col < BLOCK_COLS; col++ ) {
      blocks.push( {
        x: BLOCK_LEFT_MARGIN + col * BLOCK_W,
        y: BLOCK_TOP_MARGIN + row * BLOCK_H,
        w: BLOCK_W, h: BLOCK_H,
        color, points: POINTS_BY_COLOR[ color ],
        alive: true,
      } );
    }
  }
  state.blocks = blocks;
}

function drawBlocks() {
  state.blocks.forEach( ( block ) => {
    if ( block.alive ) {
      drawSprite( ctx, `block_${ block.color }`, block.x, block.y, block.w, block.h );
    }
  } );
}

const sounds = {
  bounce: new Audio( 'assets/sounds/ball-bounce.mp3' ),
};

function playBounceSound() {
  sounds.bounce.currentTime = 0;
  sounds.bounce.play().catch( () => {} );
}

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

const MAX_BOUNCE_ANGLE = Math.PI / 3; // 60 grados

function moveBall() {
  const prevY = ball.y;

  ball.x += ball.vx;
  ball.y += ball.vy;

  if ( ball.x - ball.radius < 0 ) {
    ball.x = ball.radius;
    ball.vx = -ball.vx;
    playBounceSound();
  } else if ( ball.x + ball.radius > canvas.width ) {
    ball.x = canvas.width - ball.radius;
    ball.vx = -ball.vx;
    playBounceSound();
  }

  if ( ball.y - ball.radius < 0 ) {
    ball.y = ball.radius;
    ball.vy = -ball.vy;
    playBounceSound();
  }

  const crossedPaddleTop = ball.vy > 0 && prevY + ball.radius <= paddle.y && ball.y + ball.radius >= paddle.y;
  const withinPaddleX = ball.x + ball.radius >= paddle.x && ball.x - ball.radius <= paddle.x + paddle.w;

  if ( crossedPaddleTop && withinPaddleX ) {
    ball.y = paddle.y - ball.radius;

    const speed = Math.hypot( ball.vx, ball.vy );
    const hitPos = ( ball.x - ( paddle.x + paddle.w / 2 ) ) / ( paddle.w / 2 );
    const clampedHitPos = Math.max( -1, Math.min( 1, hitPos ) );
    const angle = clampedHitPos * MAX_BOUNCE_ANGLE;

    ball.vx = speed * Math.sin( angle );
    ball.vy = -speed * Math.cos( angle );
    playBounceSound();
  }
}

function drawPlayingScreen() {
  ctx.fillStyle = '#000';
  ctx.fillRect( 0, 0, canvas.width, canvas.height );
  drawBlocks();
  movePaddle();
  drawSprite( ctx, 'paddle', paddle.x, paddle.y, paddle.w, paddle.h );
  moveBall();
  drawSprite( ctx, 'ball', ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2 );
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
    createBlocks();
  }
} );

window.addEventListener( 'keyup', ( e ) => {
  keys[ e.key ] = false;
} );

loadSpritesheet( () => {
  loop();
} );
