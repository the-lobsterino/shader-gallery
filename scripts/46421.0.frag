precision lowp float;

//uniform float time;

uniform vec2 resolution;

//const float count = 15.0;

void main( void ) 
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x/resolution.y;

	vec3 finalColor = vec3( 0.0 );
	
		float t = abs(1.0 / (uv.x * 50.0));
		finalColor +=  t * vec3( 0.075 + 0.1, 0.5, 2.0 );
	
	
	gl_FragColor = vec4( finalColor, 1.0 );

}