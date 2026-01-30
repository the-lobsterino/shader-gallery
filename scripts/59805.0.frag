#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {


	vec2 z = 1.3*(-resolution.xy+2.0*gl_FragCoord.xy)/resolution.y;
	
	vec2 an = 0.5*cos( vec2(0.0,1.313) + 0.2*(time+100.0) ) - 0.25*cos( vec2(0.0,1.313) + 0.4*(time+100.0) );

	float f = 1e20;
	for( int i=0; i<10; i++ ) 
	{
		z = vec2( z.x*z.x-z.y*z.y, 2.0*z.x*z.y ) + an;
		f = min( f, dot(z,z) );
	}
	
	f = 0.9+log(f)/3.0;

	gl_FragColor = vec4(f*f*f,f*f,f,1.0);
	

}
