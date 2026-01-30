#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform sampler2D backbuffer;

#define sat(val) clamp((val), 0.0, 1.0)

void main( void ) {
	vec2 p = surfacePosition*8.;//(gl_FragCoord.xy - resolution * 0.5) / max(resolution.x, resolution.y) * 8.0;	
	
	// x*x+y*y=0
	//vec4 color = floor(vec4(1. - abs(1. - (p.x*p.x + p.y*p.y)))+0.01);
	//if (color.x <= 0.99) discard;
	vec4 color = vec4(fract(1. - p.x*p.x + p.y*p.y + time));
	gl_FragColor = color ;
	gl_FragColor.a = 1.;
}

