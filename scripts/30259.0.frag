#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

varying vec2 texCoord0;

uniform sampler2D diffuse;

void main(){

	gl_FragColor = texture2D(diffuse, texCoord0);

}
