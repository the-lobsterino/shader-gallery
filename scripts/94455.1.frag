#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
        color=tan(position.x*sin(position.x)*20.+position.y*sin(position.x)*20.);
	gl_FragColor = vec4( color );

}