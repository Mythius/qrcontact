var fs = require('fs');
var file = {
	save: function(name,text){
		fs.writeFile(name,text,e=>{
			if(e) console.log(e);
		});
	},
	read: function(name,callback){
		fs.readFile(name,(error,buffer)=>{
			if (error) console.log(error);
			else callback(buffer.toString());
		});
	}
}

async function contact2qr(d,socket){
	let file_str = await generateFileName();
	let file_name = generateVCF(file_str,d);
	return file_name;
}

async function generateFileName(){
	let prom = new Promise((res,rej)=>{
		file.read('fc.txt',n=>{
			console.log('Next Num: '+n);
			let str = nToStr(n);
			file.save('fc.txt',String(Number(n)+1));
			res(str);
		});
	});
	return prom;
}

function nToStr(num){
	var letters = [];
	for(let i=0;i<10;i++)letters.push(''+i);
	for(let i=97;i<97+26;i++)letters.push(String.fromCharCode(i));
	var result="";
	let n = Number(num);
	do{
		let i = n%letters.length;
		result+=letters[i];
		n = (n-i)/letters.length;
	} while(n!=0);
	return result;
}

function generateVCF(file_str,d){
	const vcf = ['BEGIN:VCARD','VERSION:2.1'];
	vcf.push(`N:${d.last_name};${d.first_name};;;`);
	vcf.push(`FN:${d.first_name} ${d.last_name}`);
	vcf.push(`TEL;CELL:${d.cell}`);
	if(d.email) vcf.push('EMAIL;HOME:'+d.email);
	if(d.url) vcf.push('URL:'+d.url);
	vcf.push('END:VCARD');
	let file_name = 'c/'+file_str+'.vcf';
	file.save('site/'+file_name,vcf.join('\n'));
	return file_name;
}
exports.generate = contact2qr;