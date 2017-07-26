var lorenz;
var config = 
{
	rho: 28.0,
	sigma: 10.0,
	beta: 8.0/3.0,
	time: 0.01,
	points: 10000,
};

window.onload = function()
{
	lorenz = new Lorenz();
}

function Lorenz() 
{
	this.webGlRender = new THREE.WebGLRenderer();
	this.webGlRender.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(this.webGlRender.domElement);

	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 1, 5000);
	this.camera.position.set(-430, 151, -300);
	this.scene.add(this.camera); 

	this.geometry = new THREE.BufferGeometry().addAttribute( 'position', new THREE.BufferAttribute(CreateLorenzArraySolution(), 3 ));
	this.line = new THREE.Line( this.geometry );
	this.scene.add(this.line);

	this.controls = new THREE.OrbitControls(this.camera, this.webGlRender.domElement);
	this.controls.minDistance = 250;
	this.controls.maxDistance = 550;
	this.currentPointDrawn = 0;

	this.animate();
}

Lorenz.prototype.animate = function()
{
	this.geometry.setDrawRange(0, this.currentPointDrawn++);
	this.webGlRender.render( this.scene, this.camera );
	requestAnimFrame(this.animate.bind(this));
}

function CreateLorenzArraySolution()
{
	let lorenzSolution = new Float32Array(config.points * 3);
	let lorezIndex = 0;

	let x = 0.1;
	let y = 0.1;
	let z = 0.1;

	for(var i = 0; i < config.points; i++)
	{
		let dx = config.time * (config.sigma * (y - x));
		let dy = config.time * (x * (config.rho - z) - y);
		let dz = config.time * (x * y - config.beta * z);

		x += dx;
		y += dy;
		z += dz;

		lorenzSolution [lorezIndex++] = x;
		lorenzSolution [lorezIndex++] = y;
		lorenzSolution [lorezIndex++] = z;
	}

	return lorenzSolution;
}

window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||

    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();