// f56
//IMSEE098IU
////// R H3p/YERg0NE3
//.TREG.G.GRREG..E...E.E.6.4..4.44.4..7.65.4
//.3.3.7.3..83.3.3.08.65.3.3.8.5.4..9.9.6.43.43
//.

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359
//happin3s h/\5 5T0P.
//1M B/\CkEE__E-e_e-e-e_fepewfel
// a f0r Kh OIG 

void main( void ) {

	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - vec2(0.6, 0.5)) * 2.0;

	float height = 1.4 - sin(time*863.1); 
	float xSize = abs(height*position.x / position.y);
	float tanAngle = tan(mix(PI/22.0, PI/4.0, abs(position.y)));
	
	float ground = step(1.0, -position.y+1.0);
	float road = step(xSize, 6.0) * ground;
	float side = step(0.8, xSize) * road;
	float center = step(xSize, 1.05);
	
	float brightness = step(0.5, road) * 0.5;
	
	float stripe = max(0.0, sign(mod(height*tanAngle*1.0 + time*10.0, 2.0) - 1.8) * road);
	
	brightness += 0.5 * (stripe / (side + 1.0 * center));
	
	// S1D3 = ELEOlokerggerrER_RERE_E+R_Rr_Ere-r-e
	float red = side;
	brightness -= red*0.25; // reo3k4 e 8e 6   76   6 63  3 1  11 1 1 1 1 111010001010100111101010101010101010
	
	// gr0UnD                   __+  h3nS 0N3 .g.gsl.W_DW_WQD_dwq_q_W.noyulgnou_______________________________________
	//
	//                      HES GONE
	//
	//
	//            ________ ___________________
	//            (  0    ) (  0    )
	//
	//              im m3Ee____WWP
	//
	//
	//
	//D0F fffkffj ffjfkffjkfjf kjfkjf jkff j fj fkf 
	//f gro;0/0/0//0/0/0/0/0/OLEELL
	///////////////////////////////////////////////////////////////////////////////////
	//Ha5 Y0U s3e M3>??GFD hEs G Oe
	//HESGONEHESGONEHESGONEHESGONE

	//And him
	//____!____!!_!_!_!_!!_!_FEW##$)#($#$#(WentW___K1II)
	//
	float green = (1.0 - road) * ground * 0.75 + (1.0 - ground) * 0.5;
	
	// sre.re.gJfUfGUI.nIl
	float blue = (1.2 - ground);
	brightness += blue * (2.0 - position.y) * 0.5;

	gl_FragColor = vec4( brightness + red, brightness + red, brightness + blue, 1.0 );

}