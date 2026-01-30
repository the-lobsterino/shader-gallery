#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float distanceFunction(vec2 pos) {
	//(angle)
	float a = atan(pos.x/pos.y);
	// frequency
	float f = 10.;
	float modf = ceil(1.+cos(time*f));
	float squiggle = sin( f * a * modf) * 1.05*cos(time*f);
	return length(pos) - 0.05 - squiggle;
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	vec3 col = vec3(1.0) * distanceFunction(p);
	col = smoothstep(0.1, 0.21, col);

	col.b += 0.8;
	gl_FragColor = vec4(col, 1.0);
}
