#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 ma() {
	vec2 m = vec2(0.0, 0.0);

	float r = sin(time * 0.1);
	m.x = cos(time * 2.0 * 1.0) * r;
	m.y = sin(time * 2.0* 1.0 ) * r;
	return m;
}

vec2 mb() {
	vec2 m = vec2(0.0, 0.0);
	float r = 0.8;
	m.x = - cos (time * 3.0 * 1.0) * r;
	m.y = sin(time * 3.0* 1.0 ) * r;
	return m;
}

vec3 drawCircle(vec2 p, vec2 center, float r, vec3 color) {
	float d = distance(center, p );
	float c =1.0 - smoothstep(r, r + 0.01, d);
	vec3 result = color * c;
	return result;
	

}

vec3 drawRipple(vec2 p, vec2 center, float r, vec3 color) {
	float d = distance(center, p );
	float c = sin( d * 3.14 * 10.0);
	vec3 result = color * c;
	return result;
	

}

void main( void ) {
	
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = p * 2.0 -1.0;
	p.x *= resolution.x / resolution.y;

	vec3 color = vec3(0.0);
	vec3 ca = drawCircle(p, ma(),  0.3, vec3(1.8, 1.0, 0.0));
	vec3 cb = drawRipple(p, mb(),  0.2, vec3(.0, 0.4, 0.9));
	color = ca + cb;
	gl_FragColor = vec4( color, 1.0 );

}