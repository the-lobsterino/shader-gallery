#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 dist = gl_FragCoord.xy - resolution.xy*0.5;
	gl_FragColor = vec4(sin(normalize(dist).x),cos(normalize(dist).x),(sin(time)+1.0)*0.5,1.0);
}