#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 st = gl_FragCoord.xy/resolution;
	gl_FragColor = vec4(st.x,abs(cos(time * 0.5)) * mouse.y,1.0 - mouse.x,1.0);

}