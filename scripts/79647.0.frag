// Black


precision highp float;

uniform float time;
uniform vec2 resolution;
uniform float hue;

vec3 hsv2rgb(vec3 c) {
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(void) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec3 rgb = hsv2rgb(vec3(time / 5.0 + (1.0 - position.x) + position.y, 1, 1));
	vec4 rgba = vec4(rgb.xyz, 255);
	gl_FragColor = rgba;
}