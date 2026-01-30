// CFB

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy;
	vec2 p =  fract(position / (25.0+1.0*sin(time)) );
	float s = 0.4;
	float d = smoothstep(s - 0.025, s + 0.025, 0.5 - length(p - vec2(0.5, 0.5)));
	gl_FragColor = vec4(d, 0.0, 0.0, 1.0 );

}
