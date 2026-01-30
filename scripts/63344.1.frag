#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

const float SR = 48000.0;
const float n = 1024.0;
uniform float fft[513];

// Frequency difference between fft bins aka Frequency Resolution
float df = SR/n;

const float pi = 3.14159265359;

// Goes from 0 to 1 in 4 seconds probably linearly
float tx = mod(time,4.0)*0.25;


void main( void ) {
	
	
	

	vec2 position = gl_FragCoord.xy / resolution.xy ;
	
	//vec2 position = vec2(gl_FragCoord.x/resolution.x,gl_FragCoord.y/resolution.y);
		
	float color = 0.0;
	
	float c = 1.0;
	float d = 1.0;
	float e = 1.0;
	float f =1.0;
	
	float steptc = 0.0;
	float steptd = 0.0;
	float stepte = 0.0;
	float steptf = 0.0;
	
	// INCREASE 0 IN i<=0 TO ESTIMATE STEP FUNCTION WITH SINES
	// ODD HARMONICS ONLY
	
	for(int i =0 ; i<= 3; i++){
		
		steptc +=(4.0/(c*pi))*sin(2.0 * c * pi * position.x)/5.0;
		
		c+=2.0;
	
	}
	
	/*for(int i =0 ; i<= 2; i++){
		
		steptd +=(4.0/(d*pi))*sin(2.0 * d * pi * position.x)/5.0;
		
		d+=2.0;
	
	}*/
	
	for(int i =0 ; i<= 7; i++){
		
		stepte +=(4.0/(e*pi))*sin(2.0 * e * pi * position.y)/5.0;
		
		e+=2.0;
	
	}
	
	/*for(int i =0 ; i<= 2; i++){
		
		steptf +=(4.0/(f*pi))*sin(2.0 * f * pi * position.y)/5.0;
		
		f+=2.0;
	
	}*/
	
	
	vec2 p = vec2(steptc+0.5,stepte+0.5);
	
	
	// LEFT -> RIGHT
	
	if(position.y<= steptc + 0.5 && position.y >= steptc + 0.497 && position.x <tx && position.x  > tx- 0.95){
	
		color+=0.5;
	
	}
	
	/*if(position.y<= steptd + 0.5 && position.y >= steptd + 0.497 && position.x <tx && position.x  > tx- 0.95){
	
		color+=1.0;
	
	}*/
	
	// X AXIS
	
	if(position.y<= steptd + 0.5 && position.y >= steptd + 0.499){
	
		color+=0.4;
	
	}
	
	// BOTTOM -> UP
	
	if(position.x <= stepte + 0.5 && position.x >= stepte + 0.497 && position.y <tx && position.y > tx- 0.95){
	
		color+=0.5;
	
	}
	
	// Y AXIS
	
	if(position.x <= steptf + 0.5 && position.x >= steptf + 0.499){
	
		color+=0.41;
	
	}
	
	float dist = distance(position.xy,p);
	
	
	/*if(dist<0.4 && dist>0.397 && position.y <tx && position.y > tx- 0.95 && position.x <tx && position.x  > tx- 0.95){
	
		color+=1.0;
	
	}*/
	
	if(dist>0.497 && dist<0.5){
	
		color+=1.0;
	
	}
	
	
	
	
	
	gl_FragColor = vec4( vec3( color *0.1, color*0.0, color), 1.0 );

}