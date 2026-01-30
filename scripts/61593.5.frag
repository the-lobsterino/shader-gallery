#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define product(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
#define conjugate(a) vec2(a.x,-a.y)
#define divide(a, b) vec2(((a.x*b.x+a.y*b.y)/(b.x*b.x+b.y*b.y)),((a.y*b.x-a.x*b.y)/(b.x*b.x+b.y*b.y)))


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	
	
	int counter = 0;
	bool is_stabile = true;
	
	vec2 z = vec2(0.0,0.0);
	
	const int rep = 60;
	
	float zoom = -log(mouse.y);
	
	
	for( int i = 0; i < rep; ++i )
	{
		z = product(z,z)+(
			((gl_FragCoord.xy/resolution)+vec2(-0.6-mouse.x,-0.5)))
			*vec2(resolution.x/resolution.y,1.0);
		if( length(z) > 2.0 )
		{
			is_stabile = false;
			break;
		}
		counter++;
	}
	
	//if( is_stabile )
	{
		gl_FragColor = vec4( log(float(counter))/3.0, 0.0, 0.0, 1.0);
	}
	if( counter > rep/4 )
	{
		gl_FragColor = vec4(1.0, log(float(counter-rep/4))/4.0, log(float(counter-rep/4))/4.0, 1.0 );
	}

	if( length(gl_FragCoord.xy/resolution-mouse) < 0.05 )
	{
			gl_FragColor = vec4(0.0,1.0,0.0,1.0);
	}

}