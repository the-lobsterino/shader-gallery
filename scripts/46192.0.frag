precision highp float;

uniform float time;
uniform vec2 resolution;

//MODS BY 27

mat2 rotation(float angle)
{
	return mat2(sin(angle), cos(angle), -cos(angle), sin(angle));	
}

void main( void ) 
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x/resolution.y;
	uv = rotation(time) * uv;

	vec3 finalColor = vec3(10.0*(sin(time))-9.0 );
	
		float t = abs(1.0 / (uv.x * uv.y * (uv.x - uv.y) * (uv.x + uv.y) * (uv.x + 0.5 * uv.y) * (uv.x - 0.5 * uv.y) * (0.5 * uv.x + uv.y) * (0.5 * uv.x - uv.y) * 250.0));
		finalColor +=  t * vec3( 0.075 +0.1, 0.5, 2.0 );
	
	
	gl_FragColor = vec4( finalColor, 1.0 );

}