#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define l 1024

void main( void ) {

	float stuff[l];
	
	float v = 0.0;
	
	for (int i=0; i<l; i++)
	{
		v = max(v, abs(stuff[i]));
	}
	
	
	gl_FragColor = vec4( vec3( v ), 1.0 );

}