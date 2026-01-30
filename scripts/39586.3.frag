precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dPoint(vec2 uv, vec2 p, float r)
{
	return  distance(uv, p) - r;
}

float dSegment(vec2 uv, vec3 color0, vec3 color, vec2 p0, vec2 p1, float w)
{
	vec2 a = uv - p0;
	vec2 b = p1 - p0;
	return  distance(a, b *clamp(dot(a, b) / dot(b, b), 0.0, 1.0));
}

void main( void ) {
	vec2 p = (2.0 * gl_FragCoord.xy / resolution.xy -1.0) * resolution.xy / min(resolution.x, resolution.y);

	vec3 color = vec3(0.0);
	
	float d1 = dPoint(p, vec2(0.25, 0.0), 0.5);
	float d2 = dPoint(p, vec2(-0.25, 0.0), 0.5);

	color = vec3(step(max(-d1, d2), 0.0));
	gl_FragColor = vec4(color, 1.0);
}
