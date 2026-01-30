#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float hash(float n) { return fract(sin(n) * 1e4); }
float hash2(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

float noise(float x) {
	float i = floor(x);
	float f = fract(x);
	float u = f * f * (3.0 - 2.0 * f);
	return mix(hash(i), hash(i + 1.0), u);
}

float noise2(vec2 x) {
	vec2 i = floor(x);
	vec2 f = fract(x);

	// Four corners in 2D of a tile
	float a = hash2(i);
	float b = hash2(i + vec2(1.0, 0.0));
	float c = hash2(i + vec2(0.0, 1.0));
	float d = hash2(i + vec2(1.0, 1.0));

	// Simple 2D lerp using smoothstep envelope between the values.
	// return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
	//			mix(c, d, smoothstep(0.0, 1.0, f.x)),
	//			smoothstep(0.0, 1.0, f.y)));

	// Same code, with the clamps in smoothstep and common subexpressions
	// optimized away.
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main( void ) 
{
	vec2 uv = ( gl_FragCoord.xy / resolution.y );
	//vec3 color = vec3(fract(sin(dot(floor(floor(uv.xy*10.0)),vec2(5.0003,6.00007)))*357.356));
	//vec3 color = vec3(noise(uv.x+uv.y));
	vec3 color = vec3(noise2(uv));
	gl_FragColor = vec4(color,1.0);
}