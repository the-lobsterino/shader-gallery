#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 ring(vec2 coords, vec2 center, float radius, float thickness, vec3 bgColor) {
	float calculatedRadius = length(coords - center);
	float innerRadius = radius - thickness;
	float blur = 0.01;
	vec3 ringColor = vec3(255.0, 2.55, 2.55)/255.0;

	float pctOuterCircle = 1.0 - smoothstep(radius - blur, radius + blur, calculatedRadius);
	vec3 outerCirclePaint = mix(bgColor, ringColor, pctOuterCircle);
	
	float pctInnerCircle = 1.0 - smoothstep(innerRadius - blur, innerRadius + blur, calculatedRadius);
	vec3 innerCirclePaint = mix(outerCirclePaint, bgColor, pctInnerCircle);

	return innerCirclePaint;
}


float line( vec2 a, vec2 b, vec2 p )
{
	vec2 aTob = b - a;
	vec2 aTop = p - a;
	
	float t = dot( aTop, aTob ) / dot( aTob, aTob);
	
	t = clamp( t, 0.0, 1.0); //length of line
	
	float d = length( p - (a + aTob * t )  );
	d = 1.0 / d;
	d-=0.25;
	
	return clamp( d, 0.0, 1.0 );
}


void main( )
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	
	vec2 signedUV = uv * 2.0 - 1.0; //centers
	float aspectRatio = resolution.x / resolution.y;
	signedUV.x *= aspectRatio;
	signedUV.y *= -1.0;
	
	float scale = 100.0;
	const float v = 90.0;
	vec3 finalColor = vec3( 0.0 );

	
	float aniSpeed = 2.0;
	float minSize = 0.3;
	//signedUV.xy *= abs(cos(time * aniSpeed)) + minSize;
	signedUV.y *= sin(4.7);
	float t;
	for (float i=0.0; i<5.0; i+=1.0)
	{
	    float ang =  (i / 5.0 * 2.0 - 0.1) * 3.14159265358979;
	    float ang2 =  ((i + 2.0) / 5.0 * 2.0 - 0.1) * 3.14159265358979;
	    t = line( vec2(cos(ang), sin(ang)) * v, vec2(cos(ang2), sin(ang2) ) * v  , signedUV * scale );
	    //finalColor += vec3( 8.0 * t, 2.0 * t, 3.2 * t) * 1.0;
	    //finalColor += vec3( 10.0 * t, 1.6 * t * 0.0, 3.2 * t * 0.0) * 0.1;
	    finalColor += vec3( 1.0 * t, 0.01 * t, 0.01 * t) ;
	}
	
	finalColor = ring(signedUV, vec2(0.0,0.0), 0.87, 0.03, finalColor);
	
	finalColor *= clamp(sin(time*1.8)*3.0, 0.4, 4.4) ;

	gl_FragColor = vec4( finalColor, 1.0 );

}