#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = gl_FragCoord.xy - resolution*mouse;

	float c = smoothstep(1.5,.0,abs(length(uv)-100.));
	c = max(c,smoothstep(1.5,.0,abs(uv.x))*smoothstep(1.3,.0,abs(abs(uv.y)-52.)-40.));
	c = max(c,smoothstep(1.5,.0,abs(uv.y))*smoothstep(1.3,.0,abs(abs(uv.x)-52.)-40.));

	gl_FragColor = vec4( vec3( c, c, c), 1. );
}