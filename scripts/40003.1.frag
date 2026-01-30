// http://glslsandbox.com/e#39983.1

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Algorithm from processing.
float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
	return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

vec3 circle(vec2 st, vec3 color, float radius) {
	float val = map(sin(time * 10.0), -1.0, 1.0, radius, radius + 0.1);
	float pict = smoothstep(val, val + 0.08, 1.0 - distance(st, vec2(0.5)));
	return vec3(pict, pict, pict) * color;
}

void main( void ) {
	float m = min(resolution.x, resolution.y);
	vec2 st = gl_FragCoord.xy / m;
	
	st = st * 2.0 - resolution / m;
	
	vec3 color = circle(vec2(length(st)), vec3(0.1, 0.9, 0.3), 0.5);  // green
	color += circle(vec2(length(st)) - vec2(mouse), vec3(0.1, 0.2, 0.9), 0.6);  // blue

	gl_FragColor = vec4(color, 1.0);

}