#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash(vec2 p) {
	return fract(cos(p.x * 15.35 + p.y * 35.87) * 43758.99+sin(time/100.)*50.0);
}

vec4 petal(vec2 p) {
	vec2 q = p;
	q.x *= 1.5 - p.y;
	q.y += 0.01 * cos(p.x * 3.14 * 30.0) * (p.y);
	float a = length(q - vec2(0.0, 0.2)) - 0.25;
	a = smoothstep(0.01, 0.0, a);
	vec3 col = mix(vec3(0.0), vec3(1.0, 0.8 - p.y, 0.75), a);
	return vec4(col, a);		
}

vec4 flower(vec2 p, float base) {
	vec4 col = vec4(0.0);
	float theta = 2.0 * 3.141592 / 5.0;
	float t = time * 0.2+sin(time*0.01)*2.0;
	for(int i = 0; i < 5; i++) {
		float c = cos(base + theta * float(i) + t * (1.0 + 0.0002 * sin(time)));
		float s = sin(base + theta * float(i) + t);
		mat2 m = mat2(c, -s, s, c);
		
		vec4 a = petal(m * p);
		col = col + a - col * a;
	}
	return col;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = 2.0 * p - 1.0;
	p.x *= resolution.x / resolution.y;
	vec2 q = p;
	float n = 5.0;
	p = mod(p * n, 1.0) - vec2(0.5);
	float k = hash(floor(q * n));
	vec4 col = flower(p * clamp(k * 2.0, 1.0, 2.0), k * 3.141592);
	col.rgb *= clamp(k * 2.0, 0.5, 1.0);
	
	gl_FragColor = vec4( col.rgb, 1.0 );

}