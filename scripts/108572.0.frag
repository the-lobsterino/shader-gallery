#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv = fract(uv*5.);

	vec2 borders = step(vec2(.2,.3),uv);
	vec2 top = step(vec2(.1,.05),1. - uv);
	float f = borders.x * borders.y; 
	f *= top.x * top.y;

	gl_FragColor = vec4(vec3(f,f*uv.y/abs(sin(1.+time)),0.),1.);
         



}