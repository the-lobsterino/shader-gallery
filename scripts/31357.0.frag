precision mediump float;
varying vec2 v_texCoord;
uniform sampler2D s_texture;
uniform float Max;
uniform float Min;
vec4 color;
void main(){
	color = texture2D(s_texture, v_texCoord);
	gl_FragColor = color;
}