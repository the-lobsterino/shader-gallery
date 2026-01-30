#ifdef GL_ES
precision mediump float;
#endif

//DKoding

uniform float time;
uniform vec2 resolution;

void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - .5;
	float x = sin(p.x - 1. * time) * 100.;
	float y = cos(p.y - 1. * time) * 100.;
	gl_FragColor = vec4(x, y, 1,1);
}