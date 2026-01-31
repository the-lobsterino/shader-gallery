#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main( void ) {

	vec2 m = 2.0 * mouse - 1.0;
	vec2 z = surfaceSize;
	vec2 p = surfacePosition*z*m;//( gl_FragCoord.xy / resolution.xy );
	
	//p /= dot(p,p);

	float nn = 0.5 + 0.5*sin(p.x+p.y+time);	

	gl_FragColor = vec4( nn,1.0-nn,nn*nn, 1.0 );

}