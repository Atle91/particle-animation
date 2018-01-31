let image = "./images/tree.jpg";
const height = 200;
$(document).ready(() => {
	$(".upload").on("change", function(){
		const file = $(".upload")[0].files[0];
		const reader = new FileReader();

		reader.addEventListener("load", function(){
			image = reader.result;
			new p5(sketch);
		}, false);

		if(file){
			reader.readAsDataURL(file);
			
		}
		console.log(image);
		
	})
})


const sketch = (p) =>{
	let img;
	
	let pxs = [];
	p.preload = () =>{
		img = p.loadImage(image);
	}
	p.setup = () =>{
		p.pixelDensity(1);
		img.loadPixels();
		let ratio = height/img.height;

		img.resize(img.width * ratio, height);
		let count = 0;

		for(let i = 0; i < img.width; i++){
			for(let j = 0; j < img.height; j++){
				let index = (i+(j*img.width))*4;
				let red = Math.floor((img.pixels[index]/255)*100)/100;
				let green = Math.floor((img.pixels[index+1]/255)*100)/100;
				let blue = Math.floor((img.pixels[index+2]/255)*100)/100;
				if(red > 0.95 && blue > 0.95 && green > 0.95) {
					count++;
					continue;
				};
				let clr = [red, green, blue];
				let pixel = new Pixel(0+i, 0+j, clr);
				pxs.push(pixel);
				//console.log(clr);
			}
		}
		webGL(pxs, img.width);
	}

	function Pixel(x,y,clr){
		this.color = clr;
		this.target = [x,y];

	}

}


