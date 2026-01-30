precision lowp float;

uniform float time;
uniform vec2 mouse;

uniform vec2 resolution;

const float count = 7.0;

void main( void ) 
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - mouse * 2.0;
	uv.x *= resolution.x/resolution.y;

	vec3 finalColor = vec3( 0.0 );
	
		float t = sqrt(abs(1.0 / (uv.x / uv.y * 100.0)));
		finalColor +=  t * vec3( 0.075 +0.1, 0.5, 2.0 );
	
	gl_FragColor = vec4( finalColor / (finalColor + 1.0), 0.3 );


}