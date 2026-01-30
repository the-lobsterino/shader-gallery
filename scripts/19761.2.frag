#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float pi = 3.141592653589793;

float hash(vec2 p) {
	return fract(sin(p.x * 15.64 + p.y * 35.78) * 42758.93);
}


float noise(vec2 p) {
	vec2 g = floor(p);
	vec2 f = fract(p);
	vec2 k = f*f*(3.0 - 2.0*f);
	float lb = hash(g + vec2(0.0, 0.0));
	float rb = hash(g + vec2(1.0, 0.0));
	float lt = hash(g + vec2(0.0, 1.0));
	float rt = hash(g + vec2(1.0, 1.0));
	float b = mix(lb, rb, k.x);
	float t = mix(lt, rt, k.x);
	return mix(b, t, k.y);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = 2.0 * p - 1.0;
	p.x *= resolution.x / resolution.y;
	float k = 0.5 + 0.5 * atan(p.y, p.x) / (pi);
	k = 0.5 + 0.5 * sin(k * pi * 16.0);
	float col = noise(vec2(length(p), k) * 5.0 + time);

	gl_FragColor = vec4( vec3( col ), 1.0 );

}