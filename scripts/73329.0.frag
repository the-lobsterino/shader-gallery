#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.x;
	vec3 color;
	float y = uv.y + time;
	for (int i = 0; i < 3; i++) {
		float d = uv.x - sin(y * float(3+i)/3.) * .7;
		color[i] = .01 / (d * d);
	}
	gl_FragColor = vec4(color, 1);
}
