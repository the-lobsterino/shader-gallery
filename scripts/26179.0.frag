#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//what's that twitch?

float hash( vec2 v )
{
	return( 
		fract( fract(sin(v.x)) + 
		       fract(cos(v.y * v.x) * time) 
		     ) 
	);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	
	float h =  hash(p) + hash(p+time);
	gl_FragColor = vec4( 0., 1.-h*h, .5-h*h, 1.0 );

}