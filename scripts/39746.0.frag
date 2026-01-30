precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define sphere(p, size, c) d = distance(position, p); if (d < size) color = vec3(1.0 - d / size) * c;

void main(void) {
	vec2 aspect = resolution.xy / min(resolution.x, resolution.y);
	vec2 position = (gl_FragCoord.xy / resolution.xy) * aspect;
	vec3 color = vec3(0.0);
	
	vec2 center = 0.5 * aspect;
	
	float d;
	sphere(center, 0.1, vec3(1.0, 1.0, 0.0));
	sphere(center + vec2(sin(time), cos(time)) * 0.2, 0.05, vec3(1.0, 0.0, 1.0));
	sphere(center + vec2(sin(time * 0.4 + 2.0), cos(time * 0.4 + 2.0)) * 0.4, 0.025, vec3(1.0, 0.0, 0.0));
	
	gl_FragColor = vec4(color, 1.0 );
}