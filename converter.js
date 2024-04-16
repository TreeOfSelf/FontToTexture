const { createCanvas, loadImage, registerFont } = require('canvas')
const path = require('path');
const fs = require('fs');
const Jimp = require('jimp');
//Load fonts 

fonts = [];

fs.readdirSync('./fonts/', function (err, files) {
    files.forEach(function (file) {
		let fName = file.replace('.ttf',"");
        registerFont('./fonts/'+file, { family: fName});
		fonts.push(fName);
    });
});


async function crop(fname){
   const image = await Jimp.read('./texture/'+fname);
   image.autocrop()
   .write('./texture/'+fname);
}


let files = fs.readdirSync("./fonts/");
files.forEach(file => {
	let fName = file.replace('.ttf',"");
	registerFont('./fonts/'+file, { family: fName});
	fonts.push(fName);
});


canvas = createCanvas(200, 200)
ctx = canvas.getContext('2d')


function set_font(size,name){
	ctx.font = size+'px "'+name+'"';
	ctx.textAlign = "center";
}


async function generate(){

const delay = ms => new Promise(res => setTimeout(res, ms));

for(var k=0;k<fonts.length;k++){
	set_font(32,fonts[k]);
	for(var i=33;i<127;++i) {
		await delay(50);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		let character = String.fromCharCode(i)
		ctx.fillText(character, canvas.width/2,canvas.height/2);
		let fname = fonts[k]+'_'+i+'.png';
		const out = fs.createWriteStream(__dirname + '/texture/'+fname)
		const stream = canvas.createPNGStream()
		stream.pipe(out)
		out.on('finish', () =>  
		{
			crop(fname);
		})
	}
}

}

generate();

