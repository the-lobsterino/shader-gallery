#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec4 color;
uniform sampler2D texel;
varying vec2 uvVarying;

void main( void ) {

	gl_FragColor = (texture2D (texel, uvVarying) * vec4(0,0,0,0));

}