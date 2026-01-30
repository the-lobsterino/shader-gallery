#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(vec2 p, float r) {
	float d = length(p) - r;
	return smoothstep(0.01, 0.0, d);
}
void main( void ) {
	vec2 p = gl_FragCoord.xy/resolution.xy;
	p = 2.0*p - 1.0;
	p.x *= resolution.x/resolution.y;
	float interval = 3.0;
	float t = mod(time, interval)/interval;
	t = 1.0 - t*t;
	vec2 a = vec2(-1.0, 0.1);
	vec2 b = vec2(1.0, 0.5);
	vec2 c = vec2(1.0, -0.1);
	
	vec2 ab = mix(a, b, t);
	vec2 bc = mix(b, c, t);
	
	//vec2 q = mix(a, b, t); //lerp : linear interpolation
	vec2 q = mix(ab, bc, t);
	
	float color = circle(p - q, 0.1);
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
}