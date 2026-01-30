#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float pi=3.1415926; 
float ty=mod(time, 64.0)+0.3;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color;
	color += sin(position.x*10.0-0.32);
	color += tan(fract(cos(position.y*ty)*100.0)-pi+3.0*pi*ty/48.0);
	float var;
	var = fract(cos(dot(position,vec2(0.001,2.0)))*100.0);
	float var_g;
	var_g = fract(sin(dot(position,vec2(0.01,1.0)))*100.0);
	float var_b;
	var_b = fract(tan(dot(position,vec2(1990.0,82.0))+0.4*pi)*100.0);

	gl_FragColor = vec4(color+0.6*var, color+0.5*var_g, color+0.55*var_b, 1.0);

}