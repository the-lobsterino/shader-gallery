// gtr
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy )  ;

	float color = 0.0;
		if(0.90-abs(sin(p.y+sin(time)))*sin(2.*p.x*time)>length(mod(p*time,0.2)+cos( 20.*abs(p*p)/p))) 

	gl_FragColor = vec4( vec3( 0.9*abs(p.x*p.y), color * 0.8, sin( color + time / 2.0 ) * 0.75 ), 1.0 );
	else
		
	gl_FragColor = vec4( vec3(p.x/p.y, 0.5, -sin( p.x*color * time / 2.0 ) * 0.75 ), 1.0 );
}