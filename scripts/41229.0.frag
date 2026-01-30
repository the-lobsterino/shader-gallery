#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = gl_FragCoord.xy / resolution.xy;
	// Rをピクセル位置のX, Gをピクセル位置のY, BをマウスのX座標 にする
	gl_FragColor = vec4(p.x, p.y, abs(sin(time * 0.1)), 1.0);
}