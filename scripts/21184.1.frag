#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float _PIXELATION_X = 256.0;
float _PIXELATION_Y = 8.0;

vec2 pixelation	= vec2(_PIXELATION_X, _PIXELATION_Y);

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	
	position = floor(position * pixelation.xy) / pixelation.xy;
	
	float color = 0.0;
	color += sin( position.x * tan( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * tan( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 5.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 1.0 ) * 0.75 ), 1.0 );

}