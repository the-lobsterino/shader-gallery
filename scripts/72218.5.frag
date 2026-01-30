#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main( void ) {
	
	float t = abs(surfaceSize.x*surfaceSize.y) * abs(fract(time) * 2.0  - 1.0);

	vec2 uv = floor(surfacePosition*t * 256.0)+t;//gl_FragCoord.xy /resolution;
	
	float d = dot(uv-t,t-uv);
	
	vec2 m = (mouse * 2.0 - 1.0) * d;

	float color = cos( d * atan(m.y/m.x) + d) * 0.5 + 0.5;

	gl_FragColor = vec4(vec3(color), 1.0 );

}