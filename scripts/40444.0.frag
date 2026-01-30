// Trinity
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com


//"For God so loved the world, that he gave his only Son, 
// that whoever believes in him should not perish but have eternal life." (John 3:16)
	
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


#define Resolution				resolution
#define Time					time


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
	
	float scale = 100.0;
	const float v = 70.0;
	vec3 finalColor = vec3( 0.0 );
	
	float t = line( vec2(-v, -v), vec2(0.0, v), signedUV * (scale + (sin(time + 3.0)*3.0 )) );
	finalColor += vec3( 8.0 * t, 2.0 * t, 4.0 * t);
	t = line( vec2(0.0, v), vec2(v, -v), signedUV * (scale + (cos(time + 2.0)*2.0 )) );
	finalColor += vec3( 2.0 * t, 8.0 * t, 4.0 * t);
	t = line( vec2(-v, -v), vec2(v, -v), signedUV * (scale + (cos(time+ 1.0)*2.0 )) );
	finalColor += vec3( 2.0 * t, 4.0 * t, 8.0 * t);


	gl_FragColor = vec4( finalColor, 1.0 );

}