#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;

uniform vec2 resolution;

const float PI = 3.1415926535897932384626433832795;

void main( void ) {
	float part = gl_FragCoord.x / resolution.x;
	
	vec3 hsv = vec3(0.8, 1, 0);
	hsv.z = cos(part);
	
	vec3 color = hsv;

	gl_FragColor = vec4( color, 1.0);

}

vec3 hsv2rgb(vec3 c)
{
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	vec3 mixed = mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
	return c.z * mixed;
}