#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;//ここまでは行数に数えない
void main() {
vec2 p=8.0*(gl_FragCoord.xy/resolution.xy)*
	mouse;
p += sin(time);
p = fract(p);
p = p*mod(p.x+p.y,2.);
gl_FragColor=vec4(p,1,1);
}