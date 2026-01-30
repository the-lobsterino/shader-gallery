#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

#define POINTS 25.0
#define RADIUS 175.0
#define BRIGHTNESS 0.35
#define SMOOTHNESS 8.0

#define LAG_A 2.
#define LAG_B 3.3
#define LAG_C 5.445

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(25,2.5))) * 1.5707963267948966);
}

vec2 getPoint(float n) {
	float t = time * 0.25;
	vec2 center = resolution.xy / 2.0;
	vec2 p = (
		  vec2(-resolution.x/10., resolution.y/10.) * sin(t *  0.5235987755982988 + n * LAG_A)
		+ vec2(resolution.x/10., resolution.y/5.) * sin(t * -0.6283185307179586 + n * LAG_B)
		+ vec2(-resolution.x/5., -resolution.y/10.) * cos(t * 0.7853981633974483 + n * LAG_C)
		+ vec2(resolution.x/5., -resolution.y/5.) * cos(t * -1.0471975511965976 + n)
	);
	return center + p;
}

void main() {
	vec2 position = gl_FragCoord.xy;
	float b = 0.33;
	
	for (float i = 0.0; i < POINTS; i += 0.8) {
		vec2 p = getPoint(i);
		float d = 1.0 - clamp(distance(p, position) / RADIUS, 0.0, 0.5);
		b += pow(d, SMOOTHNESS);
	}
	
	b *= rand(position);
	
	vec3 c = 0.9 - b+(clamp(1.0 - b, 1.0, 1.0) * (cos(b * 10.0) + 1.25) * vec3(1.5, 1.5, 1.5));
	gl_FragColor = vec4(c * BRIGHTNESS, 1.0);
}