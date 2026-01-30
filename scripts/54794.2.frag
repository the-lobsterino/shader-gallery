#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main( void ) {
	
	float v = ((gl_FragCoord.y * resolution.x + gl_FragCoord.x) / (resolution.x*resolution.y) - 0.5);
	float u = ((surfacePosition.y * surfaceSize.x + surfacePosition.x) / (surfaceSize.x*surfaceSize.y)-0.5);
	
	vec3 o = vec3(u*u);//vec3(u*u);// * v*v);
	
	// cos( (v*v*mouse.x + u*u*mouse.y) * vec3(1.0,2.0,4.0) );
	
	o = cos(o);

	gl_FragColor = vec4( o, 1.0 );

}