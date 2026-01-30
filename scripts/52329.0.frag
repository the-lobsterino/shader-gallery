#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );

	gl_FragColor = vec4(ceil(sin(pos.x*320.0+time)), ceil(sin(pos.y*160.0-time)), ceil(cos(pos.x*320.0+time))*ceil(cos(pos.y*160.0-time)), 1.0);

}