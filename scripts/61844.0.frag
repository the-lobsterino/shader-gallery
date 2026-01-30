#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand1(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) / 4.0;

	float color = 0.5;
	

	color -=0.10*rand1(position.xy*time);
	
	gl_FragColor = vec4( vec3( color, color * 0.8, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}