
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(float x) { return fract(sin(x) * 4358.5453123); }
float rand(vec2 co) { return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5357); }
float rand(float x, float y) { return rand(vec2(x, y)); }

void main( void ) {   

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	float tmp = rand(vec2(time, rand(position)));

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	float rr = rand(tmp, 0.);
	float gg = rand(tmp, 0.);
	float bb = rand(tmp, 0.);
	gl_FragColor = vec4( rr, gg, bb, 1.0 );
}