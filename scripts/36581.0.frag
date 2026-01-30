#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : disable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color +=  tan(position.x/position.y*time);
	color *= mod(fract(time-position.x+sin(position.y)-time+abs(position.x*time)),length(mouse));

	gl_FragColor = vec4( color,vec3(fract(color-time)) );

}