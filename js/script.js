const canvas  = document.querySelector("canvas")
const ctx     = canvas.getContext('2d')
canvas.width  = window.innerWidth
canvas.height = window.innerHeight

// Particles

let particleArray = []

let mouse = {
	x: null,
	y: null,
	r: canvas.height / 80 * canvas.width / 80
}

window.addEventListener('mousemove', function (event) {
	mouse.x = event.x + canvas.clientLeft / 2
	mouse.y = event.y + canvas.clientTop / 2
})

class Particle {
	constructor(x, y, directionX, directionY, size, color) {
		this.x = x
		this.y = y
		this.directionX = directionX
		this.directionY = directionY
		this.size = size
		this.color = color
	}
	draw() {
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, false)
		ctx.fillStyle = '#ffa100'
		ctx.fill()
	}
	update() {
		if (this.x > canvas.width || this.x < 0) {
			this.directionX = -this.directionX
		}
		if (this.y > canvas.height || this.y < 0) {
			this.directionY = -this.directionY
		}

		// collision detect

		let dx = mouse.x - this.x,
			dy = mouse.y - this.y,
			distance = Math.sqrt(dx * dx + dy * dy)

		if (distance < mouse.r + this.size) {
			if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
				this.x += 10
			}
			if (mouse.x > this.x && this.x > this.size * 10) {
				this.x -= 10
			}
			if (mouse.y < this.y && this.x < canvas.height - this.size * 10) {
				this.y += 10
			}
			if (mouse.y > this.y && this.y > this.size * 10) {
				this.y -= 10
			}
		}
		this.x += this.directionX
		this.y += this.directionY
		this.draw()
	}
}

function init() {
	particleArray = []
	let numberOfParticles = canvas.width * canvas.height / 9000
	for (let i = 0; i < numberOfParticles*2; i++) {
		let size = (Math.random() * 5) + 1,
			x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2),
			y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2),
			directionX = (Math.random() * 5) - 2.5,
			directionY = (Math.random() * 5) - 2.5,
			color = '#ffa100'

		particleArray.push(new Particle(x, y, directionX, directionY, size, color))
	}
}

function connect() {
	let opacityValue = 1
	for (let i = 0; i < particleArray.length; i++) {
		for (let j = i; j <particleArray.length; j++) {
			let distance = ( (particleArray[i].x - particleArray[j].x) * (particleArray[i].x - particleArray[j].x) ) + ( (particleArray[i].y - particleArray[j].y) * (particleArray[i].y - particleArray[j].y) )
			if (distance < (canvas.width / 7) * (canvas.height / 7)) {
				opacityValue = 1 - (distance / 20000)
				ctx.strokeStyle = `rgb(255, 161, 0, ${opacityValue})`
				ctx.lineWidth = 1
				ctx.beginPath()
				ctx.moveTo(particleArray[i].x, particleArray[i].y)
				ctx.lineTo(particleArray[j].x, particleArray[j].y)
				ctx.stroke()
			}
		}
	}
}

function animate() {
	requestAnimationFrame(animate)
	ctx.clearRect(0, 0, innerWidth, innerHeight)

	for (let i = 0; i < particleArray.length; i++) {
		particleArray[i].update()
	}
	connect()
}

window.addEventListener('resize', function() {
	canvas.width  = innerWidth
	canvas.height = innerHeight
	mouse.r = canvas.height / 80 * canvas.width / 80
	init()
})

window.addEventListener('mouseout', function() {
	mouse.x = undefined
	mouse.y = undefined
})

init()
animate()