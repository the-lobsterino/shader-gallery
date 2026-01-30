#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	float tm=abs(sin(time/30.0)) * 50.0 + 1.0;

	vec2 p = floor(gl_FragCoord.xy / resolution.x * 10.0 * tm);	
	float t = mod( p.x + p.y, 2.0);
		gl_FragColor = vec4( t, t, t, 1.0);
}