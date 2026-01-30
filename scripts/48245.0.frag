#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = acos(-1.0);

const mat3 rgbToXyz = mat3(3.240479, -1.53715, -0.498535,
			  -0.969256,  1.875991, 0.041556,
			   0.055648, -0.204043, 1.057311);

const mat3 xyzToRgb = mat3(0.412453, 0.357580, 0.180423,
			   0.212671, 0.715160, 0.072169,
			   0.819334, 0.819193, 0.150227);

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy * pi * 2.0 - 1.0;

	vec3 color = vec3(0.0);
	     color = vec3(cos(position.x), sin(position.x), cos(position.x + pi)) * 0.5 + 0.5;
	     color = xyzToRgb * (rgbToXyz * color);

	gl_FragColor = vec4(color, 1.0 );

}