/*

Release with love piece and happyness!
chill @ tristanschulze.de

*/


#extension GL_OES_standard_derivatives : enable

precision lowp float;

uniform float time;
uniform vec2 resolution;


//change these constants to get different patterns!
#define c2 0.291
#define c1 vec4(3.0+c2,2.5+c2,1.5,0)


vec2 triangle_wave(vec2 a,float scale){
    return abs(fract((a+c1.xy)*scale)-.5) ;
}


void main( void ) {

	 
	 vec2 uv = (gl_FragCoord.xy-resolution.xy)/resolution.y/ 2.0;
	
	// move it continuously upwards
	 uv.y += sin(time*.001)*12.;
	
	// make some twist
	uv.y += sin(uv.x*12.)*.02;
	uv.x += cos(uv.y*22.)*.02;
		 
		 
	float offset = sin(time*.04)*.3 +.2;
	float scale  = 2.16;
	
	
	for(int i=0;i<4;i++){
		uv = triangle_wave(uv.yx-offset,scale)+triangle_wave(uv, scale + float(i)*.18);
		 
	}
	 
 	
	 float shade  = smoothstep( .02,.3,      ((uv.x)-(uv.y)));
	

	gl_FragColor = vec4(vec3(shade), 1.0 );

}