// Trinity
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com


// "Go therefore and make disciples of all nations, baptizing them in 
// the name of the Father and of the Son and of the Holy Spirit, 
// teaching them to observe all that I have commanded you. 
// And behold, I am with you always, to the end of the age." - King Jesus (Matthew 28:19-20)

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
	
	t = clamp( t, 0.01, 0.99);
	
	float d = length( p - (a + aTob * t) );
	d = 0.3 / d;
	
	return clamp( d, 0.0, 0.5 );
}


void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	
	vec2 signedUV = uv * 2.0 - 1.0;

	float freq = mix( 0.7, 0.9, sin(time*4.) );
	
	
	float scale = 55.0;
	float v = 50.0;
	vec3 finalColor = vec3( 0.0 );
	float t = line( vec2(-v, -v), vec2(-v, v), signedUV * scale );
	finalColor = vec3( 2.0 * t, 2.0 * t, 8.0 * t) * freq;
	t = line( vec2(-v, v), vec2(v, v), signedUV * scale );
	finalColor += vec3( 2.0 * t, 2.0 * t, 8.0 * t) * freq;
	t = line( vec2(v, v), vec2(v, -v), signedUV * scale );
	finalColor += vec3( 2.0 * t, 4.0 * t, 8.0 * t) * freq;
	t = line( vec2(v, -v), vec2(-v, -v), signedUV * scale );
	finalColor += vec3( 2.0 * t, 4.0 * t, 8.0 * t) * freq;

	

	gl_FragColor = vec4( finalColor, 1.0 );

}