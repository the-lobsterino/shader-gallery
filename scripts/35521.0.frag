#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
	vec2 center = resolution.xy * 0.5;
	
	vec3 color = vec3(1., 1., 1.);
	//color *= sin(time);
	color *= distance(gl_FragCoord.xy, center)/resolution.y*2.0;

	gl_FragColor = vec4(color, 1.0 );
}