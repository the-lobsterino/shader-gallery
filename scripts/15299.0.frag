#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 ma() {
	float r = 0.9;
	vec2 p = vec2(0.0);
	p.x = r * cos(time * 2.0 * 1.2);
	p.y = r * sin(time * 2.0);
	return p;
}

vec2 mb() {
	float r = 0.3;
	vec2 p = vec2(0.0);
	p.x = r * cos(time * 0.0);
	p.y = r * sin(time * 9.0);
	return p;
}

vec2 mc() {
	float r = 0.9 * sin(time);
	vec2 p = vec2(0.0);
	p.x = r * cos(time * 1.0);
	p.y = r * sin(time * 1.0);
	return p;
}

vec3 drawCircle(vec2 uv, vec2 center, float r, vec3 color) {
	float d = distance(uv, center);
	return color * (1.0 - smoothstep(r, r + 0.01, d));
}

vec3 drawRipple(vec2 uv, vec2 center, float r, vec3 color) {
	float d = distance(uv, center);
	return color * cos(uv.x * d * 3.14 * 20.0);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = p * 2.0 - 1.0;
	p.x *= resolution.x / resolution.y;
	
	vec3 color = vec3(0);
	vec3 a = drawRipple(p, ma(), 0.1, vec3(1, 1, 1));
	vec3 b = drawRipple(p, mb(), 0.05, vec3(0, 1, 0));
	vec3 c = drawRipple(p, mc(), 0.02, vec3(0, 0, 1));
	color = a + b + c;
	
	gl_FragColor = vec4( color, 3.0 );

}