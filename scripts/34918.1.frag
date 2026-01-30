#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceResolution;
varying vec2 surfacePosition;
uniform sampler2D backbuffer;

void main( void ) {
	
	//vec2 tc = surfacePosition - mouse;
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	 uv.x *= resolution.x / resolution.y;
	vec2 mousepos = mouse * 2.0-1.0;
	mousepos.x *= resolution.x / resolution.y;
	uv = mousepos - uv;
	float v = abs(sin( length(uv) * 10.0 ));
	
	gl_FragColor = vec4( vec3(sin(v + time),0.,cos(v + time*3.0) ), 1.0 );
}