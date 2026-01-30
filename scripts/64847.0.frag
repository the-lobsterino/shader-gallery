#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) {
	//normaized cords form -1 to 1
	vec2 p = (gl_FragCoord.xy - .5*resolution.xy )/resolution.y;
	//polar cordinates
	
	p = floor(64.*p)/64.0;
	vec2 pc = 10.0*vec2(length(p), length(p*p)*abs(p/p));
	float tt = time*1.0;
	
	float c = 0.9*smoothstep(0., .99, sin((pc.x-pc.y)*4.+tt)*2.4+2.-pc.y);
	 
	float d = 0.8* smoothstep(0.,.2, sin((pc.x-pc.y)*4.+tt*2.0)*2.4+2.-pc.y);
	 
	float e = 0.7*smoothstep(0.4, .2, sin((pc.x-pc.y)*4.+tt*3.0)*2.4+2.4-pc.y);
		
	gl_FragColor = vec4( vec3(c,d,e), 1.0 );

}