#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
	return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

float nn = 0.01;

float n = 1.0;
float m = 11.0;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(void) {
	vec2 xy = gl_FragCoord.xy;
	if (xy.y > resolution.y / 2.0) {
		xy.y = resolution.y - xy.y;
	}
	vec2 p = (xy / resolution.xy);
	vec3 col = vec3(0.0, 0.0, 0.0);
	float c2 = 1.0;
	float shade;
	float disty = tan(p.y * 0.5 * 3.14);
	float fog = p.y * p.y * 5.0;
	if (p.y < 0.5) {
		vec2 rp = vec2(p.x - 0.5, disty) / vec2(0.5 - p.y);
		vec2 s = vec2(floor(mod(rp.x * m, m)), floor(mod((rp.y + time * 2.0) * n, n)));
		vec2 s2 = vec2(floor(rp.x * m), floor((rp.y + time * 2.0) * n));
		if (mod(s.x + s.y, 1.0) < 1.0) {
			float r = rand(vec2(s2.y, s2.x));
			float r2 = rand(vec2(s2.x, s2.y));
			if (r > mouse.x) {
				col = hsv2rgb(vec3(0.0, 0.0, 0.0));
			} else {
				col = vec3(1.0, 1.0, 1.0);
			}
		}
	}
	vec3 bg = hsv2rgb(vec3(mouse.y, 0.8, 0.65));
	gl_FragColor = vec4(max(clamp(col - fog, 0.0, 1.0),bg), 1.0);
}