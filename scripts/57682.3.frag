#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = 2.*( gl_FragCoord.xy - .5*resolution.y )/resolution ;	
	vec3 c;
	c.rg += p;
	c.xy += p;
	c -= sin(time)*cross(p.xyx, p.yxy)*dot(p.xyx, p.yxy)*3.0;	
	gl_FragColor = vec4( vec3( c), 1.0 );

}