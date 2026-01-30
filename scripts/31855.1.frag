#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141592653589793238
void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) - 0.5;

	float th = 17.2 * asin(uv.y/uv.x * 0.35) + time * 3.0;
	mat2 rot = mat2(cos(th), -sin(th), sin(th), cos(th));
	
	float w = step(length(uv), 0.02 + 0.002 * cos(time* 140.0));	
	uv *= rot;
	uv.x -= 0.25;
	w += step(length(uv), 0.1);
	
	gl_FragColor = vec4( w );

}