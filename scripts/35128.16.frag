// Trinity
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com


#define PI 3.141592653589

#define pointInterval 3

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float line( vec2 a, vec2 b)
{
	

	
	vec2 signedUV = surfacePosition;
	

	float scale = 130.;

	
	vec2 p = signedUV*scale;

	vec2 aTob = b - a;
	vec2 aTop = p - a;
	
	float t = dot( aTop, aTob ) / dot( aTob, aTob);
	
	t = clamp( t, 0.0, 1.0);
	
	float d = pow((length( p - (a + aTob * t) )),2.);
	d = 0.001 / d;
	
	return clamp( d, 0.0, 1.0 );
}


void main( void ) {

	float r = 0., b=0.,g=0.;
	
	
	r += line(vec2(-100.,0.),vec2(100.,0.));
	r += line (vec2(0.,-50.),vec2(0.,50.));
	
	for (int i=-100; i<100; i+= pointInterval)
	{
		b += line(vec2(float(i),20.*cos(float(i))),vec2(float(i+pointInterval),20.*cos(float(i+pointInterval))));
	}
	
	
	for (int j=1; j<=100; j+= 1)
	{
		g += line( (1.0*float(j-1))*vec2(cos(float(j-1)),sin(float(j-1))), (1.0*float(j))*vec2(cos(float(j)), sin(float(j))));
		
	}
	
	
	vec3 finalColor = vec3( 0.0 );
	
	finalColor = vec3( 20.0 * r, 0.0 * r, 0.0 * r);	
	finalColor += vec3( 0.0 * b, 0.0 * b, 60.0 * b);
	finalColor += vec3( 0.0 * g, 60.0 * g, 00.0 * g);
	

	gl_FragColor = vec4( finalColor, 1.0 );

}