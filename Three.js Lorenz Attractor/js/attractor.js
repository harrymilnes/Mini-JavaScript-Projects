var lorenz;
window.onload = function()
{
	lorenz = new Lorenz();

	let gui = new dat.GUI();

	let colours_folder = gui.addFolder('Colours');

	let backgroundColour = colours_folder.addColor(lorenz, 'backgroundColour').name('Background');
	backgroundColour.onChange(function(hexColour) {
		lorenz.changeBackgroundColour(hexColour);
	});

	let lineColour = colours_folder.addColor(lorenz, 'lineColour').name('Line');
	lineColour.onChange(function(hexColour) {
		lorenz.changeLineColour(hexColour);
	});

	let sys_params_folder = gui.addFolder('System Parameters');
	sys_params_folder.add(lorenz, 'rho', 0.0, 100.0).name('Rho');
	sys_params_folder.add(lorenz, 'sigma', 0.0, 100.0).name('Sigma');
	sys_params_folder.add(lorenz, 'beta', 0.0, 8.0).name('Beta');
	sys_params_folder.add(lorenz, 'maximumPoints', 1000, 100000).name('Maximum Points');

	gui.add(lorenz, 'render').name('Render');
}

function Lorenz() 
{
  	this.rho = 28.0;
	this.sigma = 10.0;
	this.beta = 2.6;
	this.time = 0.01;
	this.maximumPoints = 10000;
	
	this.lineColour = "#2cff00";
	this.backgroundColour = "#090909";

	this.webGlRender = new THREE.WebGLRenderer();
	this.webGlRender.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(this.webGlRender.domElement);

	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 1, 5000);
	this.camera.position.set(-430, 151, -300);
	this.scene.add(this.camera); 

	this.geometry = new THREE.BufferGeometry();
	this.geometryPaths = new Float32Array(this.maximumPoints * 3);
	this.geometry.addAttribute('position', new THREE.BufferAttribute(this.geometryPaths, 3 ));
	
	this.line = new THREE.Line(this.geometry);
	this.scene.add(this.line);

	this.controls = new THREE.OrbitControls(this.camera, this.webGlRender.domElement);

	this.render();
	this.animate();
}

Lorenz.prototype.render = function()
{
	this.changeLineColour(this.lineColour);
	this.changeBackgroundColour(this.backgroundColour);
	this.createLorenzArraySolution();
	this.currentPointDrawn = 0;
	this.geometry.attributes.position.needsUpdate = true;
}

Lorenz.prototype.animate = function()
{
	this.geometry.setDrawRange(0, this.currentPointDrawn++);
	this.webGlRender.render( this.scene, this.camera );
	requestAnimFrame(this.animate.bind(this));
}

Lorenz.prototype.changeBackgroundColour = function(colour)
{
	colour.replace('#', "0x");
	this.webGlRender.setClearColor (new THREE.Color(colour), 1);
}

Lorenz.prototype.changeLineColour = function(colour)
{
	colour.replace('#', "0x");
	this.line.material.color = new THREE.Color(colour);
}

Lorenz.prototype.createLorenzArraySolution = function()
{
	let self = this;

	let lorezIndex = 0;
	let x = 0.1;
	let y = 0.1;
	let z = 0.1;

	for(var i = 0; i < self.maximumPoints; i++)
	{
		let dx = self.time * (self.sigma * (y - x));
		let dy = self.time * (x * (self.rho - z) - y);
		let dz = self.time * (x * y - self.beta * z);

		x += dx;
		y += dy;
		z += dz;

		this.geometryPaths[lorezIndex++] = x;
		this.geometryPaths[lorezIndex++] = y;
		this.geometryPaths[lorezIndex++] = z;
	}
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