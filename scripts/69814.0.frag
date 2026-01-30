#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform sampler2DArray tex;
in vec2 v_texcoord;
out vec2 color;

void main( void ) {

	color = texture(tex, vec3(v_texcoord, texSliceNum));
	thing = color.rgb;
	thing.a = alphaValue;
	color = thing;
}