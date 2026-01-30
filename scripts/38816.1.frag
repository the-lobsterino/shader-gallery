#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	gl_FragColor = vec4(uv,0.5+0.5*sin(time),1.0);


}