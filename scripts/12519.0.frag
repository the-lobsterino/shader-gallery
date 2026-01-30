#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define WOBBLE 10.0

void main( void ) {
	vec2 frg = gl_FragCoord.xy;
	vec2 mid = resolution/2.0;
	vec4 col = vec4(0.1, 0.1, 0.1, 1.0);

	col.b *= cos(frg.x+cos(time*WOBBLE));
	col.r *= sin(frg.y+sin(time*WOBBLE));
	
	col.g = (distance(frg, mid)+abs(cos(time)))/500.;
	
	gl_FragColor = col;
}