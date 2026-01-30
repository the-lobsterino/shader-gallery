#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.y *= resolution.y / resolution.x;
	gl_FragColor = vec4(1.0);
	gl_FragColor *= mix(vec4(1,0.1,0.1,1) * 0.9, vec4(1.0), smoothstep(0.2, 0.205, dot(uv, uv)));//g
	if(uv.x > -0.3  && uv.x < -0.1)  gl_FragColor = vec4(1.0);
	if(uv.y > -0.15 && uv.y < -0.05) gl_FragColor = vec4(1.0);
}