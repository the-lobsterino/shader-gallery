#ifdef GL_ES
precision mediump float;
#endif

/** GENERATOR 64x64 IMAGE:
THIS IS A PHOTOAPPARAT

<html>
	<body>
		<p></p>
		<script>
			
			var out = document.querySelector('p');
			var img = new Image();
			img.src = 'icon.png';
			img.crossOrigin = "Anonymous";
			img.onload = function() {
			
				var canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;

				console.log(canvas.width + "/" + canvas.height);
				var ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0);
				
				var data = [[]];
				var code = "";
				
				var index = 0;
				var buf = [];
				
				for(var x = 0; x < 64; ++x) {
					for(var y = 0; y < 64; ++y) {
					
						var tmp = ctx.getImageData(x, y, 1, 1);
						tmp = tmp.data;
						var r = tmp[0], g = tmp[1], b = tmp[2];
						r = (tmp[0] + tmp[1] + tmp[2]) / 3;
						r = parseInt(r);
						
						var str = r.toString(16);
						
						if(str.length == 1) {
							str = "0" + str;
						}
						
						buf.push(str);
						
						if(buf.length == 4) {
							
							code += "img[" + (index++) + "]=0x" + buf[0] + buf[1] + buf[2] + buf[3] + ";";
							buf = [];
						}
					}
				}
				
				if(buf.length != 0) {
				
					while(buf.length != 4) {
						buf.push("00");
					}
					
					code += "img[" + (index++) + "]=0x" + buf[0] + buf[1] + buf[2] + buf[3] + ";";
					buf = [];
				}
				
				out.innerHTML = code;
			}
		</script>
	</body>
</html>
*/

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define W 64
#define H 64

float rshift(float x, int n) {
	return float(int(x / pow(2.0, float(n))));	
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / (resolution.xy) );
	float r, g, b;
	float c;
	bool end = false;
	
	int img[int((W*H+3) / 4)];
	img[0] = 0x11223344;
	img[0]=0x00000000;img[1]=0x00000000;img[2]=0x00000000;img[3]=0x00000000;img[4]=0x00000000;img[5]=0x00000000;img[6]=0x00000000;img[7]=0x00000000;img[8]=0x00000000;img[9]=0x00000000;img[10]=0x00000000;img[11]=0x00000000;img[12]=0x00000000;img[13]=0x00000000;img[14]=0x00000000;img[15]=0x00000000;img[16]=0x00000000;img[17]=0x00000000;img[18]=0x00000000;img[19]=0x00000000;img[20]=0x00000000;img[21]=0x00000000;img[22]=0x00000000;img[23]=0x00000000;img[24]=0x00000000;img[25]=0x00000000;img[26]=0x00000000;img[27]=0x00000000;img[28]=0x00000000;img[29]=0x00000000;img[30]=0x00000000;img[31]=0x00000000;img[32]=0x00000000;img[33]=0x00000000;img[34]=0x00000000;img[35]=0x00000000;img[36]=0x00000000;img[37]=0x00000000;img[38]=0x00000000;img[39]=0x00000000;img[40]=0x00000000;img[41]=0x00000000;img[42]=0x00000000;img[43]=0x00000000;img[44]=0x00000000;img[45]=0x00000000;img[46]=0x00000000;img[47]=0x00000000;img[48]=0x00000000;img[49]=0x00000000;img[50]=0x00000000;img[51]=0x00000000;img[52]=0x00000000;img[53]=0x00000000;img[54]=0x00000000;img[55]=0x00000000;img[56]=0x00000000;img[57]=0x00000000;img[58]=0x00000000;img[59]=0x00000000;img[60]=0x00000000;img[61]=0x00000000;img[62]=0x00000000;img[63]=0x00000000;img[64]=0x00000000;img[65]=0x00000000;img[66]=0x00000000;img[67]=0x00000000;img[68]=0x00000000;img[69]=0x00000000;img[70]=0x00000000;img[71]=0x00000000;img[72]=0x00000000;img[73]=0x00000000;img[74]=0x00000000;img[75]=0x00000000;img[76]=0x00000000;img[77]=0x00000000;img[78]=0x00000000;img[79]=0x00000000;img[80]=0x00000000;img[81]=0x00000000;img[82]=0x00000000;img[83]=0x007b7a79;img[84]=0x7a7a7a7a;img[85]=0x7a7a7a7a;img[86]=0x7a7a7a7a;img[87]=0x7a7a7a7a;img[88]=0x7a7a7a7a;img[89]=0x7a7a7a7a;img[90]=0x7a7a7a7a;img[91]=0x7a7a7a7a;img[92]=0x7a7a7900;img[93]=0x00000000;img[94]=0x00000000;img[95]=0x00000000;img[96]=0x00000000;img[97]=0x00000000;img[98]=0x00000000;img[99]=0x7a7a7a7a;img[100]=0x7a7a7a7a;img[101]=0x7a7a7a7a;img[102]=0x7a7a7a7a;img[103]=0x7a7a7a7a;img[104]=0x7a7a7a7a;img[105]=0x7a7a7a7a;img[106]=0x7a7a7a7a;img[107]=0x7a7a7a7a;img[108]=0x7a7a7a7a;img[109]=0x00000000;img[110]=0x00000000;img[111]=0x00000000;img[112]=0x00000000;img[113]=0x00000000;img[114]=0x00000079;img[115]=0x7a7a7a7a;img[116]=0x7a7a7a7a;img[117]=0x7a7a7a7a;img[118]=0x7a7a7a7a;img[119]=0x7a7a7a7a;img[120]=0x7a7a7a7a;img[121]=0x7a7a7a7a;img[122]=0x7a7a7a7a;img[123]=0x7a7a7a7a;img[124]=0x7a7a7a7a;img[125]=0x7b000000;img[126]=0x00000000;img[127]=0x00000000;img[128]=0x00000000;img[129]=0x00000000;img[130]=0x0000007a;img[131]=0x7a7a7a7a;img[132]=0x7a7a7a7a;img[133]=0x7a7a7a7a;img[134]=0x7a7a7a7a;img[135]=0x7a7a7a7a;img[136]=0x7a7a7a7a;img[137]=0x7a7a7a7a;img[138]=0x7a7a7a7a;img[139]=0x7a7a7a7a;img[140]=0x7a7a7a7a;img[141]=0x7a000000;img[142]=0x00000000;img[143]=0x00000000;img[144]=0x00000000;img[145]=0x00000000;img[146]=0x00007b7a;img[147]=0x7a7a7a7a;img[148]=0x7a7a7a7a;img[149]=0x7a7a7a7a;img[150]=0x7a7a7a7a;img[151]=0x7a7a7a7a;img[152]=0x7a7a7a7a;img[153]=0x7a7a7a7a;img[154]=0x7a7a7a7a;img[155]=0x7a7a7a7a;img[156]=0x7a7a7a7a;img[157]=0x7a7a0000;img[158]=0x00000000;img[159]=0x00000000;img[160]=0x00000000;img[161]=0x00000000;img[162]=0x00007b7a;img[163]=0x7a7a7a7a;img[164]=0x7a7a7a7a;img[165]=0x7a7a7a7a;img[166]=0x7a7a7a7a;img[167]=0x7a7a7a7a;img[168]=0x7a7a7a7a;img[169]=0x7a7a7a7a;img[170]=0x7a7a7a7a;img[171]=0x7a7a7a7a;img[172]=0x7a7a7a7a;img[173]=0x7a7b0000;img[174]=0x00000000;img[175]=0x00000000;img[176]=0x00000000;img[177]=0x00000000;img[178]=0x00007a7a;img[179]=0x7a7a7a7a;img[180]=0x7a7a7a7a;img[181]=0x7a7a7a7a;img[182]=0x7a7a7a7a;img[183]=0x7a7a7a7a;img[184]=0x7a7a7a7a;img[185]=0x7a7a7a7a;img[186]=0x7a7a7a7a;img[187]=0x7a7a7a7a;img[188]=0x7a7a7a7a;img[189]=0x7a7a0000;img[190]=0x00000000;img[191]=0x00000000;img[192]=0x00000000;img[193]=0x00000000;img[194]=0x00007a7a;img[195]=0x7a7a7a7a;img[196]=0x7a7a7a7a;img[197]=0x7a7a7a7a;img[198]=0x7a7a7a7a;img[199]=0x7a7a7a7a;img[200]=0x7a7a7a7a;img[201]=0x7a7a7a7a;img[202]=0x7a7a7a7a;img[203]=0x7a7a7a7a;img[204]=0x7a7a7a7a;img[205]=0x7a7a0000;img[206]=0x00000000;img[207]=0x00000000;img[208]=0x00000000;img[209]=0x00000000;img[210]=0x00007a7a;img[211]=0x7a7a7a7a;img[212]=0x7a7a7a7a;img[213]=0x7a7a7a7a;img[214]=0x7a7a7a7a;img[215]=0x7a7a7a7a;img[216]=0x7a7a7a7a;img[217]=0x7a7a7a7a;img[218]=0x7a7a7a7a;img[219]=0x7a7a7a7a;img[220]=0x7a7a7a7a;img[221]=0x7a7a0000;img[222]=0x00000000;img[223]=0x00000000;img[224]=0x00000000;img[225]=0x00000000;img[226]=0x00007a7a;img[227]=0x7a7a7a7a;img[228]=0x7a7a7a7a;img[229]=0x7a7a7a7a;img[230]=0x7a7a7a7a;img[231]=0x7a7a7a7a;img[232]=0x7a7a7a7a;img[233]=0x7a7a7a7a;img[234]=0x7a7a7a7a;img[235]=0x7a7a7a7a;img[236]=0x7a7a7a7a;img[237]=0x7a7a0000;img[238]=0x00000000;img[239]=0x00000000;img[240]=0x00000000;img[241]=0x00000000;img[242]=0x00007a7a;img[243]=0x7a7a7a7a;img[244]=0x7a7a7a7a;img[245]=0x7a7a7a7a;img[246]=0x7a7a7a7a;img[247]=0x7a7a7a7a;img[248]=0x7a7a7a7a;img[249]=0x7a7a7a7a;img[250]=0x7a7a7a7a;img[251]=0x7a7a7a7a;img[252]=0x7a7a7a7a;img[253]=0x7a7a0000;img[254]=0x00000000;img[255]=0x00000000;img[256]=0x00000000;img[257]=0x00000000;img[258]=0x00007a7a;img[259]=0x7a7a7a7a;img[260]=0x7a7a7a7a;img[261]=0x7a7a7a7a;img[262]=0x7a7a7a7a;img[263]=0x7a7a7a7a;img[264]=0x7a7a7a7a;img[265]=0x7a7a7a7a;img[266]=0x7a7a7a7a;img[267]=0x7a7a7a7a;img[268]=0x7a7a7a7a;img[269]=0x7a7a0000;img[270]=0x00000000;img[271]=0x00000000;img[272]=0x00000000;img[273]=0x00000000;img[274]=0x00007a7a;img[275]=0x7a7a7a7a;img[276]=0x7a7a7a7a;img[277]=0x7a7a7a7a;img[278]=0x7a7a7a7a;img[279]=0x7a7a7a7a;img[280]=0x7a7a7a7a;img[281]=0x7a7a7a7a;img[282]=0x7a7a7a7a;img[283]=0x7a7a7a7a;img[284]=0x7a7a7a7a;img[285]=0x7a7a0000;img[286]=0x00000000;img[287]=0x00000000;img[288]=0x00000000;img[289]=0x00000000;img[290]=0x00007a7a;img[291]=0x7a7a7a7a;img[292]=0x7a7a7a7a;img[293]=0x7a7a7a7a;img[294]=0x7a7a7a7a;img[295]=0x7a7a7a7a;img[296]=0x7a7a7a7a;img[297]=0x7a7a7a7a;img[298]=0x7a7a7a7a;img[299]=0x7a7a7a7a;img[300]=0x7a7a7a7a;img[301]=0x7a7a0000;img[302]=0x00000000;img[303]=0x00000000;img[304]=0x00000000;img[305]=0x00000000;img[306]=0x007b7a7a;img[307]=0x7a7a7a7a;img[308]=0x7a7a7a7a;img[309]=0x7a7a7a7a;img[310]=0x7a7a7a7b;img[311]=0x7c000000;img[312]=0x00000078;img[313]=0x7a7a7a7a;img[314]=0x7a7a7a7a;img[315]=0x7a7a7a7a;img[316]=0x7a7a7a7a;img[317]=0x7a7a0000;img[318]=0x00000000;img[319]=0x00000000;img[320]=0x00000000;img[321]=0x00000000;img[322]=0x7c7a7a7a;img[323]=0x7a7a7a7a;img[324]=0x7a7a7a7a;img[325]=0x7a7a7a7a;img[326]=0x7a7a7700;img[327]=0x00000000;img[328]=0x00000000;img[329]=0x00717a7a;img[330]=0x7a7a7a7a;img[331]=0x7a7a7a7a;img[332]=0x7a7a7a7a;img[333]=0x7a7a0000;img[334]=0x00000000;img[335]=0x00000000;img[336]=0x00000000;img[337]=0x0000007c;img[338]=0x7a7a7a7a;img[339]=0x7a7a7a7a;img[340]=0x7a7a7a7a;img[341]=0x7a7a7a7a;img[342]=0x7a000000;img[343]=0x00000000;img[344]=0x00000000;img[345]=0x0000007c;img[346]=0x7a7a7a7a;img[347]=0x7a7a7a7a;img[348]=0x7a7a7a7a;img[349]=0x7a7a0000;img[350]=0x00000000;img[351]=0x00000000;img[352]=0x00000000;img[353]=0x00007b79;img[354]=0x7a7a7a7a;img[355]=0x7a7a7a7a;img[356]=0x7a7a7a7a;img[357]=0x7a7a7a79;img[358]=0x00000000;img[359]=0x00000000;img[360]=0x00000000;img[361]=0x00000000;img[362]=0x7b7a7a7a;img[363]=0x7a7a7a7a;img[364]=0x7a7a7a7a;img[365]=0x7a7a0000;img[366]=0x00000000;img[367]=0x00000000;img[368]=0x00000000;img[369]=0x00797a7a;img[370]=0x7a7a7a7a;img[371]=0x7a7a7a7a;img[372]=0x7a7a7a7a;img[373]=0x7a7a7900;img[374]=0x00000000;img[375]=0x00787b79;img[376]=0x7a7b7a00;img[377]=0x00000000;img[378]=0x00757a7a;img[379]=0x7a7a7a7a;img[380]=0x7a7a7a7a;img[381]=0x7a7a0000;img[382]=0x00000000;img[383]=0x00000000;img[384]=0x00000000;img[385]=0x007a7a7a;img[386]=0x7a7a7a7a;img[387]=0x7a7a7a7a;img[388]=0x7a7a7a7a;img[389]=0x7a7c0000;img[390]=0x0000007a;img[391]=0x7a7a7a7a;img[392]=0x7a7a7a7a;img[393]=0x7b000000;img[394]=0x00007b7a;img[395]=0x7a7a7a7a;img[396]=0x7a7a7a7a;img[397]=0x7a7a0000;img[398]=0x00000000;img[399]=0x00000000;img[400]=0x00000000;img[401]=0x007a7a7a;img[402]=0x7a7a7a7a;img[403]=0x7a7a7a7a;img[404]=0x7a7a7a7a;img[405]=0x7a000000;img[406]=0x0055797a;img[407]=0x7a7a7a7a;img[408]=0x7a7a7a7a;img[409]=0x7a7a0000;img[410]=0x0000007a;img[411]=0x7a7a7a7a;img[412]=0x7a7a7a7a;img[413]=0x7a7a0000;img[414]=0x00000000;img[415]=0x00000000;img[416]=0x00000000;img[417]=0x007a7a7a;img[418]=0x7a7a7a7a;img[419]=0x7a7a7a7a;img[420]=0x7a7a7a7a;img[421]=0x77000000;img[422]=0x007a7a7a;img[423]=0x7a7a7a7a;img[424]=0x7a7a7a7a;img[425]=0x7a7a7a00;img[426]=0x00000071;img[427]=0x7a7a7a7a;img[428]=0x7a7a7a7a;img[429]=0x7a7a0000;img[430]=0x00000000;img[431]=0x00000000;img[432]=0x00000000;img[433]=0x007a7a7a;img[434]=0x7a7a7a7a;img[435]=0x7a7a7a7a;img[436]=0x7a7a7a7b;img[437]=0x00000000;img[438]=0x7a7a7a7a;img[439]=0x7a7a7a7a;img[440]=0x7a7a7a7a;img[441]=0x7a7a7a7a;img[442]=0x00000000;img[443]=0x7a7a7a7a;img[444]=0x7a7a7a7a;img[445]=0x7a7a0000;img[446]=0x00000000;img[447]=0x00000000;img[448]=0x00000000;img[449]=0x007a7a7a;img[450]=0x7a7a7a7a;img[451]=0x7a7a7a7a;img[452]=0x7a7a7a7b;img[453]=0x00000000;img[454]=0x7a7a7a7a;img[455]=0x7a7a7a7a;img[456]=0x7a7a7a7a;img[457]=0x7a7a7a7a;img[458]=0x00000000;img[459]=0x7b7a7a7a;img[460]=0x7a7a7a7a;img[461]=0x7a7a0000;img[462]=0x00000000;img[463]=0x00000000;img[464]=0x00000000;img[465]=0x007a7a7a;img[466]=0x7a7a7a7a;img[467]=0x7a7a7a7a;img[468]=0x7a7a7a00;img[469]=0x0000007d;img[470]=0x7a7a7a7a;img[471]=0x7a7a7a7a;img[472]=0x7a7a7a7a;img[473]=0x7a7a7a7a;img[474]=0x7a000000;img[475]=0x007a7a7a;img[476]=0x7a7a7a7a;img[477]=0x7a7a0000;img[478]=0x00000000;img[479]=0x00000000;img[480]=0x00000000;img[481]=0x007a7a7a;img[482]=0x7a7a7a7a;img[483]=0x7a7a7a7a;img[484]=0x7a7a7a00;img[485]=0x0000007b;img[486]=0x7a7a7a7a;img[487]=0x7a7a7a7a;img[488]=0x7a7a7a7a;img[489]=0x7a7a7a7a;img[490]=0x7a000000;img[491]=0x007a7a7a;img[492]=0x7a7a7a7a;img[493]=0x7a7a0000;img[494]=0x00000000;img[495]=0x00000000;img[496]=0x00000000;img[497]=0x007a7a7a;img[498]=0x7a7a7a7a;img[499]=0x7a7a7a7a;img[500]=0x7a7a7a00;img[501]=0x00000079;img[502]=0x7a7a7a7a;img[503]=0x7a7a7a7a;img[504]=0x7a7a7a7a;img[505]=0x7a7a7a7a;img[506]=0x7a000000;img[507]=0x007a7a7a;img[508]=0x7a7a7a7a;img[509]=0x7a7a0000;img[510]=0x00000000;img[511]=0x00000000;img[512]=0x00000000;img[513]=0x007a7a7a;img[514]=0x7a7a7a7a;img[515]=0x7a7a7a7a;img[516]=0x7a7a7a00;img[517]=0x00000079;img[518]=0x7a7a7a7a;img[519]=0x7a7a7a7a;img[520]=0x7a7a7a7a;img[521]=0x7a7a7a7a;img[522]=0x7a000000;img[523]=0x007a7a7a;img[524]=0x7a7a7a7a;img[525]=0x7a7a0000;img[526]=0x00000000;img[527]=0x00000000;img[528]=0x00000000;img[529]=0x007a7a7a;img[530]=0x7a7a7a7a;img[531]=0x7a7a7a7a;img[532]=0x7a7a7a00;img[533]=0x00000079;img[534]=0x7a7a7a7a;img[535]=0x7a7a7a7a;img[536]=0x7a7a7a7a;img[537]=0x7a7a7a7a;img[538]=0x7a000000;img[539]=0x007a7a7a;img[540]=0x7a7a7a7a;img[541]=0x7a7a0000;img[542]=0x00000000;img[543]=0x00000000;img[544]=0x00000000;img[545]=0x007a7a7a;img[546]=0x7a7a7a7a;img[547]=0x7a7a7a7a;img[548]=0x7a7a7a00;img[549]=0x00000078;img[550]=0x7a7a7a7a;img[551]=0x7a7a7a7a;img[552]=0x7a7a7a7a;img[553]=0x7a7a7a7a;img[554]=0x7b000000;img[555]=0x007a7a7a;img[556]=0x7a7a7a7a;img[557]=0x7a7a0000;img[558]=0x00000000;img[559]=0x00000000;img[560]=0x00000000;img[561]=0x007a7a7a;img[562]=0x7a7a7a7a;img[563]=0x7a7a7a7a;img[564]=0x7a7a7a78;img[565]=0x00000000;img[566]=0x7a7a7a7a;img[567]=0x7a7a7a7a;img[568]=0x7a7a7a7a;img[569]=0x7a7a7a7a;img[570]=0x00000000;img[571]=0x7a7a7a7a;img[572]=0x7a7a7a7a;img[573]=0x7a7a0000;img[574]=0x00000000;img[575]=0x00000000;img[576]=0x00000000;img[577]=0x007a7a7a;img[578]=0x7a7a7a7a;img[579]=0x7a7a7a7a;img[580]=0x7a7a7a7a;img[581]=0x00000000;img[582]=0x7b7a7a7a;img[583]=0x7a7a7a7a;img[584]=0x7a7a7a7a;img[585]=0x7a7a7a7a;img[586]=0x00000000;img[587]=0x797a7a7a;img[588]=0x7a7a7a7a;img[589]=0x7a7a0000;img[590]=0x00000000;img[591]=0x00000000;img[592]=0x00000000;img[593]=0x007a7a7a;img[594]=0x7a7a7a7a;img[595]=0x7a7a7a7a;img[596]=0x7a7a7a7a;img[597]=0x77000000;img[598]=0x007a7a7a;img[599]=0x7a7a7a7a;img[600]=0x7a7a7a7a;img[601]=0x7a7a7a00;img[602]=0x00000071;img[603]=0x7a7a7a7a;img[604]=0x7a7a7a7a;img[605]=0x7a7a0000;img[606]=0x00000000;img[607]=0x00000000;img[608]=0x00000000;img[609]=0x007a7a7a;img[610]=0x7a7a7a7a;img[611]=0x7a7a7a7a;img[612]=0x7a7a7a7a;img[613]=0x7a000000;img[614]=0x00557a7a;img[615]=0x7a7a7a7a;img[616]=0x7a7a7a7a;img[617]=0x7a7a5500;img[618]=0x00000079;img[619]=0x7a7a7a7a;img[620]=0x7a7a7a7a;img[621]=0x7a7a0000;img[622]=0x00000000;img[623]=0x00000000;img[624]=0x00000000;img[625]=0x007a7a7a;img[626]=0x7a7a7a7a;img[627]=0x7a7a7a7a;img[628]=0x7a7a7a7a;img[629]=0x7a7b0000;img[630]=0x0000007a;img[631]=0x7a7a7a7a;img[632]=0x7a7a7a7a;img[633]=0x7a000000;img[634]=0x00007c7a;img[635]=0x7a7a7a7a;img[636]=0x7a7a7a7a;img[637]=0x7a7a0000;img[638]=0x00000000;img[639]=0x00000000;img[640]=0x00000000;img[641]=0x00797a7a;img[642]=0x7a7a7a7a;img[643]=0x7a7a7a7a;img[644]=0x7a7a7a7a;img[645]=0x7a7a7500;img[646]=0x00000000;img[647]=0x007d797a;img[648]=0x7a7a7b00;img[649]=0x00000000;img[650]=0x00757a7a;img[651]=0x7a7a7a7a;img[652]=0x7a7a7a7a;img[653]=0x7a7a0000;img[654]=0x00000000;img[655]=0x00000000;img[656]=0x00000000;img[657]=0x0000797a;img[658]=0x7a7a7a7a;img[659]=0x7a7a7a7a;img[660]=0x7a7a7a7a;img[661]=0x7a7a7a75;img[662]=0x00000000;img[663]=0x00000000;img[664]=0x00000000;img[665]=0x00000000;img[666]=0x757a7a7a;img[667]=0x7a7a7a7a;img[668]=0x7a7a7a7a;img[669]=0x7a7a0000;img[670]=0x00000000;img[671]=0x00000000;img[672]=0x00000000;img[673]=0x0000007a;img[674]=0x7a7a7a7a;img[675]=0x7a7a7a7a;img[676]=0x7a7a7a7a;img[677]=0x7a7a7a7a;img[678]=0x7a000000;img[679]=0x00000000;img[680]=0x00000000;img[681]=0x0000007c;img[682]=0x7a7a7a7a;img[683]=0x7a7a7a7a;img[684]=0x7a7a7a7a;img[685]=0x7a7a0000;img[686]=0x00000000;img[687]=0x00000000;img[688]=0x00000000;img[689]=0x00000000;img[690]=0x767a7a7a;img[691]=0x7a7a7a7a;img[692]=0x7a7a7a7a;img[693]=0x7a7a7a7a;img[694]=0x7a7a7100;img[695]=0x00000000;img[696]=0x00000000;img[697]=0x00717a7a;img[698]=0x7a7a7a7a;img[699]=0x7a7a7a7a;img[700]=0x7a7a7a7a;img[701]=0x7a7a0000;img[702]=0x00000000;img[703]=0x00000000;img[704]=0x00000000;img[705]=0x00000000;img[706]=0x007c7a7a;img[707]=0x7a7a7a7a;img[708]=0x7a7a7a7a;img[709]=0x7a7a7a7a;img[710]=0x7a7a7a7a;img[711]=0x7b550000;img[712]=0x00005579;img[713]=0x7a7a7a7a;img[714]=0x7a7a7a7a;img[715]=0x7a7a7a7a;img[716]=0x7a7a7a7a;img[717]=0x7a7a0000;img[718]=0x00000000;img[719]=0x00000000;img[720]=0x00000000;img[721]=0x00000000;img[722]=0x00007a7a;img[723]=0x7a7a7a7a;img[724]=0x7a7a7a7a;img[725]=0x7a7a7a7a;img[726]=0x7a7a7a7a;img[727]=0x7a7a7a7a;img[728]=0x7a7a7a7a;img[729]=0x7a7a7a7a;img[730]=0x7a7a7a7a;img[731]=0x7a7a7a7a;img[732]=0x7a7a7a7a;img[733]=0x7a7a0000;img[734]=0x00000000;img[735]=0x00000000;img[736]=0x00000000;img[737]=0x00000000;img[738]=0x00007a7a;img[739]=0x7a7a7a7a;img[740]=0x7a7a7a7a;img[741]=0x7a7a7a7a;img[742]=0x7a7a7a7a;img[743]=0x7a7a7a7a;img[744]=0x7a7a7a7a;img[745]=0x7a7a7a7a;img[746]=0x7a7a7a7a;img[747]=0x7a7a7a7a;img[748]=0x7a7a7a7a;img[749]=0x7a7a0000;img[750]=0x00000000;img[751]=0x00000000;img[752]=0x00000000;img[753]=0x00000000;img[754]=0x00007a7a;img[755]=0x7a7a7a7a;img[756]=0x7a7a7a7a;img[757]=0x7a7a7a7a;img[758]=0x7a7a7a7a;img[759]=0x7a7a7a7a;img[760]=0x7a7a7a7a;img[761]=0x7a7a7a7a;img[762]=0x7a7a7a7a;img[763]=0x7a7a7a7a;img[764]=0x7a7a7a7a;img[765]=0x7a7a0000;img[766]=0x00000000;img[767]=0x00000000;img[768]=0x00000000;img[769]=0x00000000;img[770]=0x00007a7a;img[771]=0x7a7a7a7a;img[772]=0x7a7a7a7a;img[773]=0x7a7a7a7a;img[774]=0x7a7a7a7a;img[775]=0x7a7a7a7a;img[776]=0x7a7a7a7a;img[777]=0x7a7a7a7a;img[778]=0x7a7a7a7a;img[779]=0x7a7a7a7a;img[780]=0x7a7a7a7a;img[781]=0x7a7a0000;img[782]=0x00000000;img[783]=0x00000000;img[784]=0x00000000;img[785]=0x00000000;img[786]=0x00007a7a;img[787]=0x7a7a7a7a;img[788]=0x7a7a7a7a;img[789]=0x7a7a7a7a;img[790]=0x7a7a7a7a;img[791]=0x7a7a7a7a;img[792]=0x7a7a7a7a;img[793]=0x7a7a7a7a;img[794]=0x7a7a7a7a;img[795]=0x7a7a7a7a;img[796]=0x7a7a7a7a;img[797]=0x7a7a0000;img[798]=0x00000000;img[799]=0x00000000;img[800]=0x00000000;img[801]=0x00000000;img[802]=0x00007a7a;img[803]=0x7a7a7a7a;img[804]=0x7a7a7a7a;img[805]=0x7a7a7a7a;img[806]=0x7a7a7a7a;img[807]=0x7a7a7a7a;img[808]=0x7a7a7a7a;img[809]=0x7a7a7a7a;img[810]=0x7a7a7a7a;img[811]=0x7a7a7a7a;img[812]=0x7a7a7a7a;img[813]=0x7a7a0000;img[814]=0x00000000;img[815]=0x00000000;img[816]=0x00000000;img[817]=0x00000000;img[818]=0x00007a7a;img[819]=0x7a7a7a7a;img[820]=0x7a7a7a7a;img[821]=0x7a7a7a7a;img[822]=0x7a7a7a7a;img[823]=0x7a7a7a7a;img[824]=0x7a7a7a7a;img[825]=0x7a7a7a7a;img[826]=0x7a7a7a7a;img[827]=0x7a7a7a7a;img[828]=0x7a7a7a7a;img[829]=0x7a7a0000;img[830]=0x00000000;img[831]=0x00000000;img[832]=0x00000000;img[833]=0x00000000;img[834]=0x00007a7a;img[835]=0x7a7a7a7a;img[836]=0x7a7a7a7a;img[837]=0x7a7a7a7a;img[838]=0x7a7a7a7a;img[839]=0x7a7a7a7a;img[840]=0x7a7a7a7a;img[841]=0x7a7a7a7a;img[842]=0x7a7a7a7a;img[843]=0x7a7a7a7a;img[844]=0x7a7a7a7a;img[845]=0x7a7a0000;img[846]=0x00000000;img[847]=0x00000000;img[848]=0x00000000;img[849]=0x00000000;img[850]=0x00007b7a;img[851]=0x7a7a7a7a;img[852]=0x7a7a7a7a;img[853]=0x7a7a7a7a;img[854]=0x7a7a7a7a;img[855]=0x7a7a7a7a;img[856]=0x7a7a7a7a;img[857]=0x7a7a7a7a;img[858]=0x7a7a7a7a;img[859]=0x7a7a7a7a;img[860]=0x7a7a7a7a;img[861]=0x7a7b0000;img[862]=0x00000000;img[863]=0x00000000;img[864]=0x00000000;img[865]=0x00000000;img[866]=0x00007c7a;img[867]=0x7a7a7a7a;img[868]=0x7a7a7a7a;img[869]=0x7a7a7a7a;img[870]=0x7a7a7a7a;img[871]=0x7a7a7a7a;img[872]=0x7a7a7a7a;img[873]=0x7a7a7a7a;img[874]=0x7a7a7a7a;img[875]=0x7a7a7a7a;img[876]=0x7a7a7a7a;img[877]=0x7a790000;img[878]=0x00000000;img[879]=0x00000000;img[880]=0x00000000;img[881]=0x00000000;img[882]=0x0000007a;img[883]=0x7a7a7a7a;img[884]=0x7a7a7a7a;img[885]=0x7a7a7a7a;img[886]=0x7a7a7a7a;img[887]=0x7a7a7a7a;img[888]=0x7a7a7a7a;img[889]=0x7a7a7a7a;img[890]=0x7a7a7a7a;img[891]=0x7a7a7a7a;img[892]=0x7a7a7a7a;img[893]=0x7a000000;img[894]=0x00000000;img[895]=0x00000000;img[896]=0x00000000;img[897]=0x00000000;img[898]=0x0000007b;img[899]=0x7a7a7a7a;img[900]=0x7a7a7a7a;img[901]=0x7a7a7a7a;img[902]=0x7a7a7a7a;img[903]=0x7a7a7a7a;img[904]=0x7a7a7a7a;img[905]=0x7a7a7a7a;img[906]=0x7a7a7a7a;img[907]=0x7a7a7a7a;img[908]=0x7a7a7a7a;img[909]=0x79000000;img[910]=0x00000000;img[911]=0x00000000;img[912]=0x00000000;img[913]=0x00000000;img[914]=0x00000000;img[915]=0x7a7a7a7a;img[916]=0x7a7a7a7a;img[917]=0x7a7a7a7a;img[918]=0x7a7a7a7a;img[919]=0x7a7a7a7a;img[920]=0x7a7a7a7a;img[921]=0x7a7a7a7a;img[922]=0x7a7a7a7a;img[923]=0x7a7a7a7a;img[924]=0x7a7a7a7a;img[925]=0x00000000;img[926]=0x00000000;img[927]=0x00000000;img[928]=0x00000000;img[929]=0x00000000;img[930]=0x00000000;img[931]=0x00797a7a;img[932]=0x7a7a7a7a;img[933]=0x7a7a7a7a;img[934]=0x7a7a7a7a;img[935]=0x7a7a7a7a;img[936]=0x7a7a7a7a;img[937]=0x7a7a7a7a;img[938]=0x7a7a7a7a;img[939]=0x7a7a7a7a;img[940]=0x797a7600;img[941]=0x00000000;img[942]=0x00000000;img[943]=0x00000000;img[944]=0x00000000;img[945]=0x00000000;img[946]=0x00000000;img[947]=0x00000000;img[948]=0x00000000;img[949]=0x00000000;img[950]=0x00000000;img[951]=0x00000000;img[952]=0x00000000;img[953]=0x00000000;img[954]=0x00000000;img[955]=0x00000000;img[956]=0x00000000;img[957]=0x00000000;img[958]=0x00000000;img[959]=0x00000000;img[960]=0x00000000;img[961]=0x00000000;img[962]=0x00000000;img[963]=0x00000000;img[964]=0x00000000;img[965]=0x00000000;img[966]=0x00000000;img[967]=0x00000000;img[968]=0x00000000;img[969]=0x00000000;img[970]=0x00000000;img[971]=0x00000000;img[972]=0x00000000;img[973]=0x00000000;img[974]=0x00000000;img[975]=0x00000000;img[976]=0x00000000;img[977]=0x00000000;img[978]=0x00000000;img[979]=0x00000000;img[980]=0x00000000;img[981]=0x00000000;img[982]=0x00000000;img[983]=0x00000000;img[984]=0x00000000;img[985]=0x00000000;img[986]=0x00000000;img[987]=0x00000000;img[988]=0x00000000;img[989]=0x00000000;img[990]=0x00000000;img[991]=0x00000000;img[992]=0x00000000;img[993]=0x00000000;img[994]=0x00000000;img[995]=0x00000000;img[996]=0x00000000;img[997]=0x00000000;img[998]=0x00000000;img[999]=0x00000000;img[1000]=0x00000000;img[1001]=0x00000000;img[1002]=0x00000000;img[1003]=0x00000000;img[1004]=0x00000000;img[1005]=0x00000000;img[1006]=0x00000000;img[1007]=0x00000000;img[1008]=0x00000000;img[1009]=0x00000000;img[1010]=0x00000000;img[1011]=0x00000000;img[1012]=0x00000000;img[1013]=0x00000000;img[1014]=0x00000000;img[1015]=0x00000000;img[1016]=0x00000000;img[1017]=0x00000000;img[1018]=0x00000000;img[1019]=0x00000000;img[1020]=0x00000000;img[1021]=0x00000000;img[1022]=0x00000000;img[1023]=0x00000000;
		
	int x = int(float(W) * position.x);
	int y = H - 1 - int(float(H) * position.y);
	
	
	for(int i = 0; i < W; ++i) {
		
		if(i == x) {
		
			for(int j = 0; j < H; ++j) {
				
				if(j == y) {
					
					float chunk = float(img[(i + j*W) / 4]);
					
					int pos = 3 - int(mod(float(i + j*W), 4.0));
					
					if(pos == 0) {
						c = mod(float(chunk), 256.0);
					}
					else if(pos == 1) {
						c = mod(rshift(chunk, 8), 256.0);
					}
					else if(pos == 2) {
						c = mod(rshift(chunk, 16), 256.0);
					}
					else if(pos == 3) {
						c = mod(rshift(chunk, 24), 256.0);
					}
					
					r = g = b = c / 255.0;
					
					end = true;
					break;
				}
			}
		}
		
		if(end) break;
	}
	
	gl_FragColor = vec4(r, g, b, 1.0);

}