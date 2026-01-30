#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;
uniform sampler2D backTexture;

float mod2rule( vec2 p )
{
	vec4 sum = vec4(0.0);
	
	for ( float y = -1.0; y < 2.0; y++ )
	{
		for ( float x = -1.0; x < 2.0; x++ )
		{
			sum += texture2D( backTexture, floor(p+vec2(x,y) + 0.5)/resolution );
		}
	}
	
	return mod(sum.r+sum.g+sum.b,2.0);
}

void main( void ) {
	
	float r = mod2rule( gl_FragCoord.xy );
	
	vec2 p = ((gl_FragCoord.xy/resolution) * 2.0 - 1.0);
	
	float o = dot(p,p);
	
	if ( 0.05 < mod(time*1e-2,0.1) ) r = fract(r-o);
	
	gl_FragColor = vec4( vec3( fract(r) ), 1.0 );

}