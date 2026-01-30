#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution;
	float d = distance(mouse, uv);
	d = smoothstep(0.0, 0.01, d);
	d = 1.0 - d;
	
	gl_FragColor = texture2D(backbuffer, uv);
	gl_FragColor += vec4(d);
}