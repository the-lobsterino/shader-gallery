#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;

uniform vec2 resolution;



void main( void ) {
	
	float x =  gl_FragCoord.x ;// 100.0;
	float y =  gl_FragCoord.y ;// 100.0;
	
	if(x<resolution.x/2.0 && y<resolution.y/2.0 && x>resolution.x/4.0 && y>resolution.y/4.0) 	
	gl_FragColor = vec4(0.0,   x,   y, 1.0);
	
}