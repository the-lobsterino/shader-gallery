/* lame-ass tunnel by kusma */

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = (gl_FragCoord.xy - resolution * 0.5) / resolution.yy;
	position.y += dot(position,position);
	float th = atan(position.y, position.x) / (0.1 * 3.1415926) + 0.5 + mouse.x;
	float dd = length(position);
	float d = 0.25 / dd + time + mouse.y;

	vec3 uv = vec3(th + d, th - d, th + sin(d) * 0.1);
	float a = 0.5 + cos(uv.x * 3.1415926 * 2.0) * 0.5;
	float b = 0.5 + cos(uv.y * 3.1415926 * 2.0) * 0.5;
	float c = 0.5 + cos(uv.z * 3.1415926 * 6.0) * 0.5;
	vec3 color = mix(vec3(2.0, 0.7, 0.6), vec3(0.1, 0.1, 0.2), pow(a, 0.2)) * 0.75;
	color += mix(vec3(1.8, 1.9, 0.3), vec3(0.1, 0.1, 0.2),  pow(b, 0.1)) * 0.75;
	color += mix(vec3(1.3, .5, 1.3), vec3(0.1, 0.2, 0.2),  pow(c, 0.1)) * 0.75;
	gl_FragColor = vec4(color * clamp(dd, 0.0, 1.0), 1.0);
}