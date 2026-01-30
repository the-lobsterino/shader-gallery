#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 m = (mouse*2.-1.) * vec2(resolution.x/resolution.y,1.);

float map( vec2 p ) {
	float b1 = length(p)-.5;
	float b2 = length(p-m)-.5;
	return max(-b1,b2) ;
}

vec3 dcolor( float d ) {
	vec3 c = d<0.? vec3(0.,1.,.5) : vec3( 1.-d, d*.5, d );
	return( c * (smoothstep(.0,.02,abs(mod(d-.05, .1)*2.-.1))) ) ;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2. - 1.;
	p.x *= resolution.x/resolution.y;
	if(m.y > .9) m = vec2(0.2);

	float d = map(p);
	
	vec3 c = dcolor( d );

	if (mouse.y > 0.5 ^^ abs(p.y)>.001 )
		gl_FragColor = vec4( c, 1. );
	else
		gl_FragColor = vec4( .05/max(0.,d) );

}