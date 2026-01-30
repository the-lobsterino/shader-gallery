#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}


void main( void ) {

	float x = gl_FragCoord.x - resolution.x / 2.;
	float y = gl_FragCoord.y - resolution.y / 2.;
	
	float distance = sqrt(x * x + y * y);
	
	float rnd = rand(vec2(0., distance));
	
	float mouseDistance = sqrt((gl_FragCoord.x - mouse.x * resolution.x) * (gl_FragCoord.x - mouse.x * resolution.x) / 20. + (gl_FragCoord.y - mouse.y * resolution.y) * (gl_FragCoord.y - mouse.y * resolution.y)) / 100.;
	
	float r = sin(distance / 35.4 - time) * mouseDistance;
	float g = sin(distance / 35.2 - time) * mouseDistance;
	float b = sin(distance / 35. - time) * mouseDistance;
	
	gl_FragColor = vec4(1. + sin(time / 2.) - r, 1. + sin(time / 4.) - g, 1. + sin(time / 6.) - b, 1.);

}