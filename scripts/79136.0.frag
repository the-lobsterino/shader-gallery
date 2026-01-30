#extension GL_OES_standard_derivatives : enable
#define AA 4.0

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 hyperbolic(vec2 p) {
	float denominator = 1.0 + sqrt(abs(1.0 - p.x * p.x + p.y * p.y));
	return vec2(2.0 * p.x / denominator, 2.0 * p.y / denominator);
}

vec2 spherical(vec2 p, float z) {
	float X = p.x / (1.0 - z);
	float Y = p.y / (1.0 - z);
	float denominator = 1.0 + X * X + Y * Y;
	
	return vec2(2.0 * X / denominator, 2.0 * Y / denominator) / ((-1.0 + X * X + Y * Y) / denominator);
}

vec2 lerp(vec2 a, vec2 b, float i) {
	return a + (b - a) * i;
}

vec3 image(vec2 p) {
	float t = time;
	vec2 position = (p - 0.5 * resolution) / min(resolution.x, resolution.y);
	position *= clamp(sin(t * 1.5) * 0.5 + 0.6, 0.0, 1.1) * 2.0;

	vec2 pos = lerp(hyperbolic(position), spherical(position, 1.4), clamp(sin(t * 0.5) * 2.0 + 1.0, 0.0, 1.0));
	vec3 color = vec3(0.0);
	vec2 pt = vec2(fract(pos.x * 10.0 + t * 4.0 + mouse.x * 10.0) - 0.5, fract(pos.y * 10.0 + sin(t * 2.0) * 2.0 + mouse.y * 10.0) - 0.5);
	
	if(abs(pt.x) > 0.45 || abs(pt.x) > 0.45) {
		color = pow(distance(pt, vec2(0.0)), 5.0) * vec3(pos, 1.0) * 10.0;
	} else {
		color = pow(distance(pt, vec2(0.0)), 3.0) * vec3(pos, 1.0) * 1.4;
	}
	
	color = clamp(color, 0.0, 1.0);
	
	return color;
}

void main( void ) {
	vec3 color = vec3(0.0);
	
	for(float x = 0.0; x < AA; x++) {
		for(float y = 0.0; y < AA; y++) {
			color += image(gl_FragCoord.xy + vec2(x, y) / AA - 1.0);
		}
	}
	
	color /= AA * AA;

	gl_FragColor = vec4( color, 1.0 );
}