#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float r = 100.0;
const float r2 = pow(r, 2.0);


void main( void ) {

	vec3 color = vec3(0.0, 0.0, 0.0);
	
	float p = pow(gl_FragCoord.x-mouse.x*resolution.x, 2.0)+pow(gl_FragCoord.y-mouse.y*resolution.y, 2.0);

	if(p<r2+1500.0 && p > r2-1500.0) color = vec3(1.0, 1.0, 1.0);
	
			gl_FragColor = vec4(color, 1.0 );
	



}