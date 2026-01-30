#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define circle(u,r) (length(u)-r)
#define f(a,b) (max(a,b) > 0. ? min(a,b) : -max(a,b))
void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy )-.5;
	uv.x *= resolution.x/resolution.y;

	float d = circle(uv+.05,0.2);
	d = f(d,circle(uv-.05,0.2));

	gl_FragColor = vec4(fract(d*20.),step(d,0.),d, 1.0 );
}