#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D texture; 

void main( void ) {

	vec4 color = texture2D(texture, vec2(0.5, 0.5));

	gl_FragColor = color;

}
