#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 image( vec2 p, float t ) {
	return vec4(
		step(length( p - vec2(sin(t*1.5) *.2,cos(t)*.3) ),.5 ),
		step(length( p - vec2(sin(t*1.25)*.4,cos(t)*.7) ),.5 ),
		step(length( p - vec2(sin(t*1.0) *.5,cos(t)*.4) ),.5 ),
		0. );
}

void main( void ) {
	vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy ) / resolution.y  ;
	
	float t1 = time;
	float t2 = time-.033;

	gl_FragColor = max(
		image( p, t1 ),
		image( p, t2 )*.25);
}