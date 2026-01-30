#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	float col = cos( 10.0 / (sin(3.0*6.28*pos.x+time)*cos(time)+0.5 - pos.y));
	gl_FragColor = vec4(1.0-col, 0.0, col, 1.0 );

}