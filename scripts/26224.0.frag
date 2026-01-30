#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//what's that twitch?
// It's the matrix :**

float hash( vec2 v )
{
	v*=1000.;
	return( 
		fract( fract(sin(v.x * 5.2) * .52838) + 
		       fract(cos(v.y * v.x * 0.1 - time*1.9) * 6.0) 
		     ) 
	);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	
	float h =  hash(p) + hash(p*3.92598);
	gl_FragColor = vec4( 0., 1.-h*h, .5-h*h, 1.0 );

}