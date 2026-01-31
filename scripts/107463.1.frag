
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(float x) { return fract(sin(x) * 4358.5453123); }
float rand(vec2 co) { return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5357); }
float rand(float x, float y) { return rand(vec2(x, y)); }

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 9.9;
	float tmp = rand(vec2(floor(time * 8.), rand(position)));

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 95.0 ) * 20.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 75.0 ) * 30.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 55.0 ) * 90.0 );
	color *= sin( time / 10.0 ) * 0.5;

	float rr = rand(tmp, 1.) > .5 ? 1. : 0.;
	float gg = rand(tmp, 2.) > .5 ? 1. : 0.;
	float bb = rand(tmp, 3.) > .5 ? 1. : 0.;
	gl_FragColor = vec4( rr, gg, bb, 1.0 );
}