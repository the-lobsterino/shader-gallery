#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define r resolution
void main( void ) {
	vec2 p = gl_FragCoord.xy/r.xy * 2.0 - 1.0;
	p.x *= r.x/r.y;
	float d = smoothstep( 0.5*cos(time), 0.5 + 0.01*sin(time), distance(p, vec2(1.2*cos(time), -0.01*sin(time) * 0.2)) );
	vec3 c = vec3(d, p.y*sin(time), abs(cos(time*0.2)));
	gl_FragColor = vec4(c, 2.3);
}