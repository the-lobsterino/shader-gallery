#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_fragmentColor ;
varying vec2 v_texCoord;

uniform vec2 center;
uniform vec2 resolution;
uniform float time ;

void main( void ) {
	
	
vec4 dick = 	 vec4(time,1.0,time,1.0);
gl_FragColor = dick;
	if(dick[0]>1.0)
		dick[1] -= .8;
		
	
}