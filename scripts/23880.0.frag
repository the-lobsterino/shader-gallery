// Procedural Toon Shader Ramp Texture
// By: Brandon Fogerty
// bfogerty@gmail.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

#define StripeCount			5
#define StartColor			vec3( 0.0, 0.0, 0.0 )
#define EndColor			vec3( 1.0, 1.0, 1.0 )


void main( void ) 
{	
	float widthOfEachStripe = resolution.x / float(StripeCount);
	float t = mod( floor( gl_FragCoord.x / widthOfEachStripe ), float(StripeCount) );
	vec3 finalColor = mix( StartColor, EndColor, t / (float(StripeCount)-1.0) );
	
	gl_FragColor = vec4( finalColor, 1.0 );
}