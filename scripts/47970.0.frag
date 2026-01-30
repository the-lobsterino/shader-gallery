#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	//float k = 1.0 - pow(dot(uv, uv), 0.2);
	uv = pow(uv, vec2(3.0));
	float k = 1.0 - dot(uv, uv);
	gl_FragColor = vec4(k);
}