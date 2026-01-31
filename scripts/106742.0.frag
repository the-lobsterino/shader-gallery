#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = gl_FragCoord.xy/resolution.xy*2.-1.;
	p.x*=0.5;

	gl_FragColor = vec4(floor((p.y/p.x))/10.+abs(sin(time*4.5)));

}