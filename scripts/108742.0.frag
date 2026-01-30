#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2. - 1.;
	uv.x *= resolution.x/resolution.y;
	
	vec2 p = uv;
	
	p *= mat2(5,0,0,5);
	p *= mat2(cos(time),-sin(time),sin(time),cos(time))+2.;
	uv = fract(uv*9.)+atan(uv.x*8.);

	float hill = 1. - abs(p.x-p.y);
	
	gl_FragColor = vec4(vec3(hill+uv.y,hill,0.),1.);
}