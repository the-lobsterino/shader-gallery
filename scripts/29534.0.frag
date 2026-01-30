#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
	vec2 p = gl_FragCoord.xy / resolution;
	p = 2.0 * p - 1.0;
	p.x *= resolution.x / resolution.y;
	p.x += 0.8;
	vec3 col = mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.8, 0.3), sqrt(0.5 * p.y + 0.5));

	float r = 0.2 + 0.1 * cos(atan(p.y, sin(p.x)) * 10.0 + 20.0 * p.x + sin(time*3.));
	float k = smoothstep(r, r + 0.03, length(p));
	col *= k;
	
	r = 0.015;
	r += 0.005 * cos(p.y * 120.0);
	r += exp((-p.y - 1.0) * 10.0);
	col *= 1.0 - (1.0 - smoothstep(r, r + 0.002, abs(p.x - 0.25 * sin(p.y * 2.0)))) * ((1.0 - smoothstep(0.1, 0.1, p.y)));
	
	gl_FragColor = vec4(col, 1.0);
}