#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

const float PI = 3.14159265359;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;

	if(p.x*p.x + p.y*p.y < 0.25) {
		vec3 col = hsv2rgb(vec3(atan(p.y, p.x) / (2.0*PI) - time/2.0, 1.0, 1.0));
		gl_FragColor = vec4( col, 1.0 );
	}

}