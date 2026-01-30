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
		fract( fract((v.x)) + 
		       fract((v.y)) 
		     ) 
	);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	gl_FragColor = vec4(vec3(hash(p+fract(time*p))), 1.);

}