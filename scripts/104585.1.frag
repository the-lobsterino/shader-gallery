#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy * 2. - resolution.xy ) / max(resolution.x, resolution.y);
	uv *= sin(time) + 1.3;
	float f = 4.;
	float a = .22;
	float s = step(sin(uv.y * f + time) * a + cos(uv.y * f*2.1 - time) * a*.7,abs(uv.x)-.4);
	gl_FragColor = vec4( mix(vec3(.5,.3,.5),vec3(.25,.5,.44),s), 1.0 );
}