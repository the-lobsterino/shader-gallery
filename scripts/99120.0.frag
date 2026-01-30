#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float sinTime = (sin(time) + 1.) / 2.;
	vec2 toMouse = mouse - uv;
	vec2 uvc = (fract(uv * 1.) - vec2(.5)) * 2.;
	vec2 mouseUvc = (mouse - vec2(.5)) * -.5;
	float uvcLen = length(uvc);
	vec3 col = vec3(1);

	col *= step(length(uvc * vec2(.5, 1. + 1. * sinTime)), .5);
	col *= step(.2, length(uvc * vec2(.5) - clamp(toMouse * .5, vec2(-.3), vec2(.2))));

	gl_FragColor = vec4(col, 1.0 );

}