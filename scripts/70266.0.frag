#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float tau = acos(0.0) * 4.0;

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	vec3 color = vec3(p, 0.0);
	if (length(p) < 1.0) {
		float t = atan(p.y, p.x);
		color = vec3(t / tau + 0.5);
	}

	gl_FragColor = vec4(color, 1.0);
}
