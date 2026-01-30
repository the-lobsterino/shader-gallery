#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float m_2pi = 3.14159265359 * 2.0;

vec3 getColor( vec2 ndc )
{
	float rfactor = cos( ndc.y*25.0 + time*10.0 + mouse.x*100.0 )*sin( ndc.x*256.0 );
	
	return vec3(rfactor*0.5 );
}


void main( void ) 
{
	// ndc calculation
	vec2 screenPos = gl_FragCoord.xy / resolution.xy;
	vec2 ndc = ( screenPos - vec2(0.5) ) * 2.0; // + mouse / 4.0;
	
	gl_FragColor.xyz = getColor( ndc );
}