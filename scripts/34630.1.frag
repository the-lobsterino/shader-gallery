#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
#define r resolution
void main( void ) {
	vec2 p = gl_FragCoord.xy/r.xy * 1.8;
	p.x *= r.x/r.y;
	float d = smoothstep( 0.7, 0.7, 0.7 );
	vec3 c = vec3(0.8, p.y, 0.999);
	gl_FragColor = vec4(c, 1);
}