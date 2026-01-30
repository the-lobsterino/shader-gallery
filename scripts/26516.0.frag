#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float get_gain(float k) {
	k = 1.0 - k;
	k = 1.0 - cos(k * k * k * 2.0 * 3.14 + 0.5);
	//return max(0.0, k);
	return k;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy / resolution.xy );
	float k = uv.x;
	gl_FragColor = vec4(get_gain(k));
}