#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define pi 3.1415926536

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) + mouse / 1.0;
	pos.x = (gl_FragCoord.x-resolution.x/2.0)/resolution.x*3.0;
	pos.y = (gl_FragCoord.y-resolution.y/2.0)/resolution.x*3.0;
		
	float color = 0.0;
	
	color=sqrt(pow(pos.x,sin(time)*8.0)+sin(time)*pow(pos.y,2.0));
	if(color>0.6){
		color=0.8;
	}else{
		color=0.4;
	}
		
	gl_FragColor = vec4( color*cos(time)*2.0,color*0.1*cos(time),color*0.7, 1.0 );

}