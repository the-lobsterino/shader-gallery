#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) / 0.01;
	
	float color = 1.0;
	color *= (sin(position.x*.1) * cos(position.y*.1)) * 0.5 + 0.5;
	color *= (sin(position.x*.2) * cos(position.y*.2)) * 0.5 + 0.5;
	color *= (sin(position.x*.4) * cos(position.y*.4)) * 0.5 + 0.5;
	color *= (sin(position.x*.8) * cos(position.y*.8)) * 0.5 + 0.5;
	color *= 3.0;

	gl_FragColor = vec4( vec3( color, color , color  ), 1.0 );

}