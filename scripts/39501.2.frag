#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = (gl_FragCoord.xy/resolution.xy) -0.5;
float y = 0.2 * sin(200.0*position.x - 20.0*time*0.35);
//y = 1.0 / (500. * abs(position.y – y));

gl_FragColor = vec4(y, y, y* 5., 1.0);


}