
function webGL(pxs, imgWidth){
	let gl,program,a_color,a_position, u_resLocation, 
	colorBuffer, positionBuffer,position, vel,velTemp,
	color,a_target,a_velocity,force, target,targetBuffer,velocityBuffer,canvas,
	width,height;
	let mousePos = {x: 0, y: 0}
	let velocity = 1.0;
	let v = 0.001;
	let paused = false;
	function init(){
		canvas = document.getElementById("myCanvas");
		gl = canvas.getContext("webgl");
		height = gl.canvas.clientHeight;
		width = gl.canvas.clientWidth;
		gl.canvas.width = width;
		gl.canvas.height = height;
		if(!gl){
			console.log("no gl for you!")
		}
		function createShader(type, source){
			let shader = gl.createShader(type);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
			if(success){
				return shader;
			}
			console.log(gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
		}
		function createProgram(vertexShader, fragmentShader){
			let program = gl.createProgram();
			gl.attachShader(program, vertexShader);
			gl.attachShader(program, fragmentShader);
			gl.linkProgram(program);
			let success = gl.getProgramParameter(program, gl.LINK_STATUS);
			if(success){
				return program;
			}
			console.log(gl.getProgramInfoLog);
			gl.deleteProgram(program);
		}

		let vertexShaderSource = document.getElementById("VertexShader").text;
		let fragmentShaderSource = document.getElementById("FragmentShader").text;
		let vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
		let fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

		program = createProgram(vertexShader, fragmentShader);
		gl.useProgram(program);
	}
	init();

	setupParticles();

	a_color = gl.getAttribLocation(program, "a_color");
	a_position = gl.getAttribLocation(program, "a_position");
	a_target = gl.getAttribLocation(program, "a_target");
	a_velocity = gl.getAttribLocation(program, "a_velocity");
	gl.enableVertexAttribArray(a_velocity);
	gl.enableVertexAttribArray(a_color);
	gl.enableVertexAttribArray(a_position);
	gl.enableVertexAttribArray(a_target);

	gl.viewport(0, 0, width, height);

	u_resLocation = gl.getUniformLocation(program, "u_resolution");
	const u_imgWidth = gl.getUniformLocation(program, "u_imgWidth");
	const u_random = gl.getUniformLocation(program, "u_random");
	const u_positions = gl.getUniformLocation(program, "u_positions");
	const u_mouse = gl.getUniformLocation(program, "u_mouse");
	gl.uniform4f(u_positions, window.innerWidth * 0.388, (height/2), window.innerWidth * 0.612, height/2);
	gl.uniform1f(u_random, Math.floor(Math.random()*5));
	gl.uniform1f(u_imgWidth, imgWidth);
	gl.uniform2f(u_resLocation, width, height);

	forceBuffer = gl.createBuffer();
	colorBuffer = gl.createBuffer();
	positionBuffer = gl.createBuffer();
	targetBuffer = gl.createBuffer();
	velocityBuffer = gl.createBuffer();
    /*canvas.addEventListener("mousemove", function(evt){
        mousePos = getMousePos(canvas, evt);

        

    }, false);
    function getMousePos(canvas, evt){
        let rect = canvas.getBoundingClientRect();
        //move mouse
        if(mousePos.x !== evt.clientX - rect.left ||
         mousePos.y !== Math.abs((evt.clientY - rect.top)-(489-rect.top)) ){
            force = force.map((f, i) => {
                return f = 0 
            })
    }else{
        force = force.map((f, i) => {

            return f = Math.min(f + 0.01, Math.PI/2); 
        })
    }
    console.log(force)


    return{
        x: evt.clientX - rect.left,
        y: Math.abs((evt.clientY - rect.top)-(489-rect.top))
    };
}
*/
(function animationLoop(){
	if(!paused){
		setupWebGL();
		updateParticles();
		setBufferData();
		drawScene();


	}
	requestAnimationFrame(animationLoop, canvas);
})();

function setupParticles(){
	target = [];
	color = [];
	position = [];
	velTemp = [];
	const middle = [imgWidth/2, height/2];
	const maxDistance = imgWidth/2 + height/2;
	let dFromMiddle;
	pxs.map((pixel,i) => {
		color.push.apply(color, pixel.color);
		target.push.apply(target, [pixel.target[0]+(window.innerWidth/2-imgWidth/2), pixel.target[1]+(height/2)]);
		dFromMiddle = 
			Math.abs(pixel.target[0] - middle[0])+
			Math.abs(pixel.target[1] - middle[1]);

		/*if(i < pxs.length/2){position.push.apply(position, [0, Math.random()*400])}
			else{position.push.apply(position, [window.innerWidth-50, Math.random()*400])}*/
				position.push.apply(position, [window.innerWidth, (Math.random()*25)+100]);
				velTemp.push.apply(velTemp, [setVelocity(dFromMiddle, maxDistance+40)]);
		})
	vel = velTemp;

}
function setVelocity(distance, maxDistance){
		return 1 - (distance / maxDistance);}
function updateParticles(){
	vel = velTemp.map((v, i) => {
		return v = v+vel[i]*1.01;
	});
	


}

function setupWebGL(){
	gl.clearColor(0,0,0,0);
	gl.clear(gl.COLOR_BUFFER_BIT);

}
function setBufferData(){
    //gl.uniform2f(u_mouse, mousePos.x, mousePos.y)
    
    gl.bindBuffer(gl.ARRAY_BUFFER, forceBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(force), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, targetBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(target), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, velocityBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vel), gl.STATIC_DRAW);

}



function drawScene(){
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 0 ,0);

	gl.bindBuffer(gl.ARRAY_BUFFER, targetBuffer);
	gl.vertexAttribPointer(a_target, 2, gl.FLOAT, false, 0 ,0);

	gl.bindBuffer(gl.ARRAY_BUFFER, velocityBuffer);
	gl.vertexAttribPointer(a_velocity, 1, gl.FLOAT, false, 0,0);

	gl.drawArrays(gl.POINTS, 0, position.length/2)
}

}
new p5(sketch);