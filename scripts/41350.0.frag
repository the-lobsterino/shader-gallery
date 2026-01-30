#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



void main( void ) 
{
	vec2 position = vec2(gl_FragCoord.xy / resolution.xy);
	float distances = distance(gl_FragCoord.zz,position.xy);
	
	gl_FragColor = vec4(distances * position.x * sin(time)/2.0,distances*position.x*sin(time)*4.0,distances*position.y/4.0,1.0);
}