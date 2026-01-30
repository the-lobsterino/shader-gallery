#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution; 

void main( void ) {
	vec2 uv = ( 2.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
	gl_FragColor = normalize(1. - dot(uv + mouse.x, uv - mouse.y) * vec4(15.4214 + mouse.y,1.41241 - mouse.x,3.5623 - mouse.x,1.4352 + mouse.y));
}