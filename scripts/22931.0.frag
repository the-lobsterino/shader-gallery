#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 co = floor( 1.0* gl_FragCoord.xy + 1.0);
	float timeD = floor(.64*time-sqrt(length(co.yx*pow(co, vec2(0.1333)))));
	float color = fract(sin(dot(co.xy ,vec2(12.9898+timeD,0.233*timeD))) * 43758.5453);
	float color2 = 0.25 + 0.5*floor(0.9 + color);
	gl_FragColor = vec4( vec3( color2, color2, color2), 1.0 );

}