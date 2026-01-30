#ifdef GL_ES
precision mediump float;
#endif

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


void main(  )
{
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	
	vec2 signedUV = uv * 2.0 - 1.0; //centers
	float aspectRatio = resolution.x / resolution.y;
	signedUV.x *= aspectRatio;
	signedUV.y *= -1.0;
	
	float scale = 40.0;
	const float v = 90.0;
	vec3 finalColor = vec3( 0.0 );
	
	float timePulse = clamp(sin(time*2.0), 0.5, 2.4);
	float t = line( vec2(0.0, -4.0 + v * 0.4), vec2(0.0, -4.0 -v * 0.3), signedUV * scale );
	finalColor += vec3( 8.0 * t, 4.0 * t, 2.0 * t) * 0.5 * timePulse;
	
	t = line( vec2(-v * 0.2, -v*0.1), vec2(v * 0.2, -v*0.1), signedUV * scale );
	finalColor += vec3( 8.0 * t, 4.0 * t, 2.0 * t) * 0.4 * timePulse;	

	gl_FragColor = vec4( finalColor, 1.0 );

}