#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(vec2 p, float r) {
	float d = length(p) - r;
	return smoothstep(0.01, 0.0, d);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy * 2.0 - 1.0 );
	p.x *= resolution.x / resolution.y;

	float a = circle(p - vec2(-0.25, -0.25), 0.5);
	float b = circle(p - vec2(0.25, -0.25), 0.5);
	float c = circle(p - vec2(0.0, 0.25), 0.5);
	
	float color = max(min(a, b), c);

	gl_FragColor = vec4( vec3( color ), 1.0 );

}