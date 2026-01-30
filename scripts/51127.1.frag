#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//	<https://www.shadertoy.com/view/4dS3Wd>
//	By Morgan McGuire @morgan3d, http://graphicscodex.com
//
float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

float noise(float x) {
	float i = floor(x);
	float f = fract(x);
	float u = f * f * (3.0 - 2.0 * f);
	return mix(hash(i), hash(i + 1.0), u);
}

float noise(vec2 x) {
	vec2 i = floor(x);
	vec2 f = fract(x);

	// Four corners in 2D of a tile
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));

	// Simple 2D lerp using smoothstep envelope between the values.
	// return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
	//			mix(c, d, smoothstep(0.0, 1.0, f.x)),
	//			smoothstep(0.0, 1.0, f.y)));

	// Same code, with the clamps in smoothstep and common subexpressions
	// optimized away.
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

#define OCTAVES 4
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .6;
    float frequency = 0.0;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .3;
    }
    return value;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
	p.x *= resolution.x/resolution.y;
	
	vec3 col = vec3(0.0);
	float r = sqrt(dot(p - mouse + 0.5, p - mouse + 0.5));
	float a = atan(-p.y, p.x) * 2.0;
	
	float d = fbm(vec2(6.0 * a, 14.0 * p.y) + time * 2.75);
	col = mix(col, vec3(0.95, 0.95, 0.95), smoothstep(0.6, 0.7, d + 0.5));
	
	d = 0.4 * fbm(p * 3.0 + time);
	col = mix(col, vec3(0.1, 0.1, 0.1), smoothstep(0.6, 0.7, r + d));
	
	gl_FragColor = vec4( col, 1.0 );

}