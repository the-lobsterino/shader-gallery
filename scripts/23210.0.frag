#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
	float scale = 0.2;
	//8bit starten effect.
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * scale;
	vec2 pixelation = vec2(320.0, 200.0);
	uv = floor(uv * pixelation);
	vec2 position = uv + sin(time * 2.0 / 4.0);

	float color = 0.0;
	
	float timescale = 0.5;
	float timer = time * timescale;
	
	color += sin( position.x * cos( timer / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( timer / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( timer / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( timer / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3(color * tan(time * 6.0), 0.1 * sin(time * 8.0), cos( color + time / 3.0 ) * 0.75 ), 1.0 );
}