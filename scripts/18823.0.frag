#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main (void) {
	vec2 uv = (gl_FragCoord.xy / resolution.xy);
	float d = distance(uv*2.0-vec2(0.5, 0.5), vec2(0.5, 0.5));
	float c =smoothstep(0.5, 0.55, d);
	gl_FragColor = vec4(c, c, c, 1.0);
}
