/*
Controls:
Left Player
[w] Move up
[d] Move down
[x] Laser Blast / Serve

Right Player
[Arrow Up] Move up
[Arrow Down] Move down
[Arrow Right] Laser Blast / Serve

Main Goal:
The goal of each player is to prevent the ball from touching their side of the field
by bouncing it away using their paddles. If they failed to do so, their opponent scores
a point.

Serving:
Before serving, the ball moves up and down across the paddle of the player who is serving.
The ball will move to the direction based on its position from the server's paddle 
before it is served away.

Ball Mechanics:
The game picks a random ball speed after being served, and the ball also moves a little
faster every time it hits a paddle. If the ball hits the nearest edge of a paddle, it 
will bounce back instead of bouncing away.

Laser Blast:
Every time the ball hits a paddle, the player who owns the paddle will gain 1 energy. If
the ball bounced from the paddle's nearest edge, the player will instead gain 2 energy.
At 10 energy, a player can press its Laser Blast button to shoot a Laser Beam. If the
Laser Beam hits the opponent's paddle, the player will score a point.
*/

// Frames per second
const FPS = 120

// Speed increment of the ball every time it hits a paddle
const INCREMENT = 0.2

// Laser speed of each paddle
const LASER_SPEED = 15

// Definition of variables which holds element objects
const leftPaddle = document.querySelector('.left')
const rightPaddle = document.querySelector('.right')
const ballObj = document.querySelector('.ball')
const leftScoreBoard = document.querySelector('#score-left')
const rightScoreBoard = document.querySelector('#score-right')
const text = document.querySelector('#serve-help')
const leftLaser = document.querySelector('#laser-left')
const rightLaser = document.querySelector('#laser-right')
const energyMeterLeft = document.querySelector('#energy-front-left')
const energyMeterRight = document.querySelector('#energy-front-right')

// Set the Right paddle's x-position
rightPaddle.style.marginLeft = 790 + 'px'

// Define both paddles' and lasers' properties
const paddles = [{obj: leftPaddle, y: 200, energy: 0},
				{obj: rightPaddle, y: 200, energy: 0}]
let lasers = [{obj: leftLaser, x: 0, y: 0, active: false},
				{obj: rightLaser, x: 790, y: 0, active: false}]

// Define global variables
let lastRenderTime = 0
let ball
let activePaddle
let leftScore = 0
let rightScore = 0
let keys = {}

// Resets a laser's properties
const resetLaser = (index) => {
	if(index == 0){
		lasers[index] = {obj: leftLaser, x: 0, y: 0, active: false}	
	}
	else{
		lasers[index] = {obj: rightLaser, x: 790, y: 0, active: false}
	}
	lasers[index].obj.style.visibility = 'hidden'	
}

// Resets both lasers' properties
const resetLasers = () => {
	for(let i = 0; i < lasers.length; i++){
		if(i == 0){
			lasers[i] = {obj: leftLaser, x: 0, y: 0, active: false}	
		}
		else{
			lasers[i] = {obj: rightLaser, x: 790, y: 0, active: false}
		}
		lasers[i].obj.style.visibility = 'hidden'
	}
}

// Assigns the other player as server
const changeActivePaddle = () => {
	if(activePaddle == paddles[0]){
		text.style.marginLeft = '160px'
		text.innerText = 'Press [Arrow Right] to serve'
		text.style.visibility = 'inherit'
		activePaddle = paddles[1]
		return
	}

	activePaddle = paddles[0]
	text.style.marginLeft = '235px'
	text.innerText = 'Press [X] to serve'
	text.style.visibility = 'inherit'
}

// Resets the ball's and each paddle's properties, also resets each energy meter
const reset = () => {	
	for(let i = 0; i < paddles.length; i++){
		paddles[i].energy = 0
		paddles[i].y = 200
		paddles[i].obj.style.marginTop = paddles[i].y + 'px'
	}

	ball = {obj: ballObj, x: 0, y: 200, xvel: 0, yvel: 5, active: true, served: false}
	
	updateEnergyMeters()
}

// Called whenever an energy meter needs a visual update
const updateEnergyMeters = () => {
	energyMeterLeft.style.height = `${((10 - paddles[0].energy)/10) * 71}px`
	energyMeterRight.style.height = `${((10 - paddles[1].energy)/10) * 71}px`
}

// Runs while the ball is not yet served
const holdingBall = (paddle) => {

	// sets the balls position
	if(activePaddle == paddles[1]){
		ball.x = 770
		ball.obj.style.marginLeft = ball.x + 'px'
	}
	else{
		ball.x = 10
		ball.obj.style.marginLeft = ball.x + 'px'		
	}

	// move the ball up and down across the holding paddle
	if(ball.y < paddle.y || ball.y + 20 > paddle.y + 100){
		ball.yvel *= -1
	}

	ball.y += ball.yvel
	ball.obj.style.marginTop = ball.y + 'px'
}

// This function moves the ball, and handles ball collisions
const moveBall = () => {

	// if the ball is not served, run holdingBall function instead
	if(!ball.served){
		holdingBall(activePaddle)
		return
	}

	let diff = 0
	ball.x += ball.xvel
	ball.y += ball.yvel

	// This if block handles ball collisions for the left paddle
	//
	// if the ball is in line with the paddle horizontally
	if(ball.x < 10 && ball.active){

		// and if the ball is in the range of the body of the paddle vertically
		// it means that the ball has collided with the paddle successfully
		if(paddles[0].y < ball.y + 20 && paddles[0].y + 100 > ball.y){

			// get position of the ball on the paddle when the ball landed on it
			diff = ball.y + 10 - paddles[0].y

			// if the ball is moving downwards
			if(ball.yvel > 0){

				// and the ball landed near the top edge
				if(diff < 40){

					// bounce the ball back, and give the left player 1 energy
					ball.yvel *= -1
					paddles[0].energy ++
				}
			}

			// else if the ball is moving upwards
			else{

				// and the ball landed near the bottom edge
				if(diff > 60){

					// bounce the ball back, and give the left player 1 energy
					ball.yvel *= -1
					paddles[0].energy ++
				}
			}

			// if the ball is moving to the right, increment the ball's x-velocity by adding the increment
			if(ball.xvel > 0){
				ball.xvel += INCREMENT
			}

			// else, increment it by subtracting the increment.
			else{
				ball.xvel -= INCREMENT
			}

			// give 1 energy to the left player, and then reverse the ball's horizontal direction
			paddles[0].energy ++
			ball.xvel *= -1
		}

		// if not, it means the ball went beyond the paddle, set the "active" property of the 
		// ball to false to prevent the ball from reversing its direction. That's why we need
		// ball.active to true in line 178
		else{
			ball.active = false
		}
	}
	// This if block handles ball collisions for the right paddle
	//
	// If the ball is in line with the right paddle horizontally
	if(ball.x + 20 > 790 && ball.active){

		// and if the ball is in the range of the body of the paddle vertically
		// it means that the ball has collided with the paddle successfully
		if(paddles[1].y < ball.y + 20 && paddles[1].y + 100 > ball.y){

			// get position of the ball on the paddle when the ball landed on it
			diff = ball.y + 10 - paddles[1].y

			// if the ball is moving downwards
			if(ball.yvel > 0){

				// and the ball landed near the top edge of the paddle
				if(diff < 40){

					// bounce the ball back, and give the right player 1 energy
					ball.yvel *= -1
					paddles[1].energy ++
				}
			}

			// else if the ball is moving upwards
			else{

				// and the ball landed near the bottom edge of the paddle
				if(diff > 60){

					// bounce the ball back, and give the right player 1 energy
					ball.yvel *= -1
					paddles[1].energy ++
				}
			}

			// if the ball is moving to the right, increment the ball's x-velocity by adding the increment
			if(ball.xvel > 0){
				ball.xvel += INCREMENT
			}

			// else, increment it by subtracting the increment.
			else{
				ball.xvel -= INCREMENT
			}

			// give 1 energy to the right player, and then reverse the ball's horizontal direction
			paddles[1].energy ++
			ball.xvel *= -1
		}

		// if not, it means the ball went beyond the paddle, set the "active" property of the 
		// ball to false to prevent the ball from reversing its direction. That's why we need
		// ball.active to true in line 236
		else{
			ball.active = false
		}
	}

	// if the ball touched the left edge of the screen, add 1 to the score of the right player,
	// then reset needed values in preparation for the next round.
	if(ball.x < -10){
		rightScore ++
		rightScoreBoard.innerText = rightScore
		resetLasers()
		changeActivePaddle()
		reset()
		return
	}

	// do the same if the ball touched the right edge of the screen, but add 1 to the score of the
	// right player
	else if(ball.x > 800){
		leftScore ++
		leftScoreBoard.innerText = leftScore
		resetLasers()
		changeActivePaddle()
		reset()
		return
	}

	// energy cannot exceed 10
	if(paddles[0].energy > 9) paddles[0].energy = 10
	if(paddles[1].energy > 9) paddles[1].energy = 10

	// update energy meters visually
	updateEnergyMeters()

	// if the ball touched the bottom or top edge of the screen, reverse its vertical direction
	if(ball.y > 480 || ball.y < 0){
		ball.yvel *= -1
	}

	// update the ball visually
	ball.obj.style.marginTop = ball.y + 'px'
	ball.obj.style.marginLeft = ball.x + 'px'
}

// this function handles keyboard inputs and its interactions
const movePaddles = () => {
	if(!ball.served){

		// if the ball is not served, only allow [x] if the current server is the left player
		// or [Arrow Right] if the current server is the right player
		if(activePaddle == paddles[0] && !keys.x) return
		else if(activePaddle == paddles[1] && !keys.ArrowRight) return

		// hide visual instructions on screen
		text.style.visibility = 'hidden'

		// pick a random x-velocity for the ball with values ranging from 5 - 9
		const vel = Math.floor(Math.random() * 5) + 5

		// if the server is the right player, move the ball towards the left
		if(activePaddle == paddles[1]){
			ball.xvel = vel * -1
		}

		// if the server is the left player, move the ball towards the right
		else{
			ball.xvel = vel
		}

		// The ball's vertical velocity is determined by the ball's position 
		// on the paddle the moment it is served
		const diff = ball.y - activePaddle.y
		if(diff < 10){
			ball.yvel = -9
		}
		else if(diff < 30){
			ball.yvel = -7
		}
		else if(diff < 50){
			ball.yvel = -5
		}
		else if(diff > 90){
			ball.yvel = 9
		}
		else if(diff > 70){
			ball.yvel = 7
		}
		else{
			ball.yvel = 5
		}

		// move the ball and set its "served" property to true
		ball.x += ball.xvel
		ball.served = true
		return
	}

	// move the left paddle upwards
	if(keys.w){
		paddles[0].y -= 10
		if(paddles[0].y < 0){
			paddles[0].y = 0
		}
	}
	// move the left paddle downwards
	else if(keys.s){
		paddles[0].y += 10
		if(paddles[0].y > 400){
			paddles[0].y = 400
		}	
	}

	// move the right paddle upwards
	if(keys.ArrowUp){
		paddles[1].y -= 10
		if(paddles[1].y < 0){
			paddles[1].y = 0
		}
	}
	// move the right paddle downwards
	else if(keys.ArrowDown){
		paddles[1].y += 10
		if(paddles[1].y > 400){
			paddles[1].y = 400
		}	
	}

	// if a paddle has 10 energy, shoot a laser when the required button is pressed
	if(paddles[0].energy == 10){
		if(keys.x){
			paddles[0].energy = 0
			lasers[0].y = (paddles[0].y + 50)
			lasers[0].active = true
			lasers[0].obj.style.visibility = 'inherit'
			lasers[0].obj.style.marginTop = lasers[0].y + 'px'
		}
	}
	if(paddles[1].energy == 10){
		if(keys.ArrowRight){
			paddles[1].energy = 0
			lasers[1].y = (paddles[1].y + 50)
			lasers[1].active = true
			lasers[1].obj.style.visibility = 'inherit'
			lasers[1].obj.style.marginTop = lasers[1].y + 'px'
		}
	}

	// update the paddles visually
	paddles[0].obj.style.marginTop = paddles[0].y + 'px'
	paddles[1].obj.style.marginTop = paddles[1].y + 'px'
}

// randomly assigns the first server
const determineFirst = () => {
	const paddleIndex = Math.floor(Math.random() * 2)
	activePaddle = paddles[paddleIndex]
	changeActivePaddle()
}

// this function handles laser movements and collisions
const moveLasers = () => {
	for(let i = 0; i < lasers.length; i++){

		// if a laser is shot
		if(lasers[i].active){

			// and the laser came from left player
			if(i == 0){

				// move it towards right
				lasers[i].x += LASER_SPEED
				lasers[i].obj.style.marginLeft = lasers[i].x + 'px'

				// if the laser hit the right player, add 1 to the left player's score
				// and reset everything in preparation for the next round
				if(lasers[i].x + 30 > 790){
					if(lasers[i].y + 10 > paddles[i].y && lasers[i].y < paddles[0].y + 100){
						leftScore ++
						leftScoreBoard.innerText = leftScore
						resetLasers()
						changeActivePaddle()
						reset()
					}
				}

				// reset the laser if it hits the right edge of the screen
				if(lasers[i].x > 800){
					resetLaser(i)
				}
			}

			// and the laser came from the right player
			else if(i == 1){

				// move it towards left
				lasers[i].x -= LASER_SPEED
				lasers[i].obj.style.marginLeft = lasers[i].x + 'px'

				// if the laser hit the left player, add 1 to the right player's score
				// and reset everything in preparation for the next round
				if(lasers[i].x < 10){
					if(lasers[i].y + 10 > paddles[0].y && lasers[i].y < paddles[0].y + 100){
						rightScore ++
						rightScoreBoard.innerText = rightScore
						resetLasers()
						changeActivePaddle()
						reset()
					}
				}

				// reset the laser if it hits the left edge of the screen
				if(lasers[i].x + 30 < 0){
					resetLaser(i)
				}
			}

		}
	}
}

// initialize game
determineFirst()
reset()

// ############# Main Loop ####################

const main = (time) => {
	window.requestAnimationFrame(main)
	if((time - lastRenderTime) < 1000 / FPS) return
	lastRenderTime = time

	moveBall()
	movePaddles()
	moveLasers()
}

// ############# Main Loop ####################

// initialize main loop
window.requestAnimationFrame(main)

// adds keys that are being held down to the "keys" array
document.addEventListener('keydown', (e) => {
	keys[e.key] = true
})

// when the key has stopped being pressed down, remove the
// key from the "keys" array
document.addEventListener('keyup', (e) => {
	delete keys[e.key]
})

