#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void )
{

	vec2 uPos = ( gl_FragCoord.xy / resolution.xy );//normalize wrt y axis
	//uPos -= vec2((resolution.x/resolution.y)/2.0, 0.0);//shift origin to center
	
	uPos.x -= 0.5;
	
	float vertColor = 0.0;
	vec3 glowColor = vec3(2.5, 2.0, 0.5);
	
	for( float i = 0.0; i < 1.0; ++i )
	{
		uPos.y += sin( uPos.y + time) * 0.1 - 0.5;
		uPos.x += cos( uPos.x + time) * 0.1;
	
		float fTemp = abs(1.0 / ((uPos.x) * uPos.y) / 100.0);
		vertColor += fTemp;
	}
	
	vec4 color = vec4( vertColor * glowColor.x, vertColor * glowColor.y, vertColor * glowColor.z, 1.0 );
	gl_FragColor = color;
}