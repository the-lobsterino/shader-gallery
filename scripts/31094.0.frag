#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;

uniform vec2 resolution;

void main( void ) {
	
	//gl_Position =  gl_ModelViewProjectionMatrix  * gl_Vertex;
	gl_FragColor = Vec4(1,1,1,1);
}