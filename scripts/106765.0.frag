#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 center = vec2(1.0, 0.0);

vec4 ring(vec2 center, vec2 pos, float r0, float r1) {
	float dist = length(pos - center);
	float delta = fwidth(dist);
	float alpha = 1.0 - smoothstep(r0 - delta, r0 + delta, dist) - smoothstep(r1 - delta, r1 + delta, dist);
	return vec4(1.0, 1.0, 1.0, alpha);
}

void main( void ) {
	vec2 pos = (2.0 * gl_FragCoord.xy - resolution) / max(resolution.x, resolution.y);

	vec4 color = vec4(0.0);
	color += ring(center, pos, 0.5, 0.8);

	gl_FragColor = color;

}