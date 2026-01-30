#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	float d = abs(uv.y - .2 * sin(uv.x + time));
	float t = 1. / d;
	vec2 st = uv * t + vec2(0., t + time);
	vec3 color = vec3(.8, 0., .2);
	color = mix(color, vec3(.5, .4, 0.), cos(4. * (2. * st.x - cos(st.y * .2)) + time) *
	sin((st.y - cos(st.x + time)) + time));
	color = mix(color, vec3(0., .6 * cos(st.x), .9), cos(st.x * 4.) * cos(st.y * 4.));
	gl_FragColor = vec4(color, 1.) * d * d * d;
}