// Changes by @xprogram

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform vec2 surfaceSize;
void main(){
	gl_FragColor = vec4(1);
	vec2 p = (surfacePosition)*32.*surfaceSize;
	p.x /= resolution.x / resolution.y;
	vec2 c = fract(p+time);
	vec2 C = p - c;
	gl_FragColor *= 1./(1.+length(C));
	gl_FragColor = pow(gl_FragColor*4.5,vec4(10));
}