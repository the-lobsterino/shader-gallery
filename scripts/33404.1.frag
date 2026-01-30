// Trinity
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com






#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float line( vec2 a, vec2 b, vec2 p )
{
	vec2 aTob = b - a;
	vec2 aTop = p - a;
	
	float t = dot( aTop, aTob ) / dot( aTob, aTob);
	
	t = clamp( t, 0.0, 1.0);
	
	float d = length( p - (a + aTob * t) );
	d = 1.0 / d;
	
	return clamp( d, 0.0, 1.0 );
}


void main( void ) {

	float aspectRatio = resolution.x / resolution.y;
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	
	vec2 signedUV = uv * 2.0 - 1.0;
	signedUV.x *= aspectRatio;

	float freqA = mix( 0.4, 1.0, 0.1 );
	float freqB = mix( 0.4, 1.2, 0.1  );
	float freqC = mix( 0.4, 1.2, 0.1 );
	
	
	float scale = resolution.x;
	const float v = 70.0;
	vec3 finalColor = vec3( 0.0 );
	
	float t = line( vec2(-v, -v), vec2(0.0, v), signedUV * scale );
	
	finalColor = vec3( 8.0 * t, 2.0 * t, 4.0 * t) * freqA;
	t = line( vec2(0.0, v), vec2(v, -v), signedUV * scale );
	finalColor += vec3( 2.0 * t, 8.0 * t, 4.0 * t) * freqB;
	t = line( vec2(-v, -v), vec2(v, -v), signedUV * scale );
	finalColor += vec3( 2.0 * t, 4.0 * t, 8.0 * t) * freqC;
	
	t = line( vec2(100, 100), vec2(1000, 0), signedUV * scale );
	finalColor += vec3( 2.0 * t, 4.0 * t, 8.0 * t) * freqC;
	
	t = line( vec2(100, 100), vec2(1000, 100), signedUV * scale );
	finalColor += vec3( 2.0 * t, 4.0 * t, 8.0 * t) * freqC;
	
	t = line( vec2(100, 100), vec2(1000, 200), signedUV * scale );
	finalColor += vec3( 2.0 * t, 4.0 * t, 8.0 * t) * freqC;
	

	

	gl_FragColor = vec4( finalColor, 1.0 );

}