#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main() {
	vec2 st = gl_FragCoord.xy/resolution;
	vec2 ms = gl_FragCoord.xy*mouse;
	gl_FragColor = vec4(sin(ms.x),sin(ms.y),0.0,1.0);
}
