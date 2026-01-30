// Warped Hex
// By: Brandon Fogerty
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float c( vec2 p ) {		
	//p.y += mod( floor(p.x), 4.0) * 0.5;
	//p = abs( fract(p)- 0.5 );
	//return 1.-abs( max(p.x*1.5 + p.y, p.y * 2.0) - 1.0 )*10. ;
	return (length(fract(p)-.5)-.4)*50.;
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;	
	uv/=dot(uv,uv);
	uv.x+=time*3.;uv.y+=time*2.;
	gl_FragColor = vec4( vec3(c(uv)), 1.0 );
}