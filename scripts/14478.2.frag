#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform sampler2D texture;

void main() {

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	gl_FragColor = vec4(fract(uv), 1.0, 1.0);

}