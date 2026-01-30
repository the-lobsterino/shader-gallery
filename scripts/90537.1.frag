#extension GL_OES_standard_derivatives : enable

precision lowp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

int FPS;
float ALPHA;
void main( void )
{
	FPS = 120;
	ALPHA = .5;
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color_r = 0.0;
	float color_g = 1.0;
	float color_b = 0.0;

	gl_FragColor = vec4( vec3( color_r, color_g * 0.5, tan( color_b + time / 3.14 ) * 0.75 ), ALPHA );
}