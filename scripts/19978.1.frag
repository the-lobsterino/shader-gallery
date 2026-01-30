#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circ(vec2 p, float r) {
	return length(p) - r;
}

float hash(vec2 p) {
	return fract(sin(p.x * 15.23 + p.y * 35.78) * 43758.49);
}

float smin( float a, float b, float k ) {
	float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 5.0 );
	return mix( b, a, h ) - k*h*(1.0-h);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = p * 2.0 - 1.0;
	p.x *= resolution.x / resolution.y;
	float col = 0.0;
	float da = length(p - vec2(-0.25, 0.0)) - 0.5;
	float db = length(p - vec2(0.25, 0.0)) - 0.5;
	float aa = smoothstep(0.01, 0.0, da);
	float ab = smoothstep(0.01, 0.0, db);
	col = pow(smoothstep(0.0, 1.0, min(da, db)), 0.2);
	gl_FragColor = vec4( vec3( col ), 1.0 );

}