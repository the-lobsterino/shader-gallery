#extension GL_OES_standard_derivatives : enable

precision highp float;
#define res resolution;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec4 color;
void main( void ) {
	color = vec4(vec3(1.*asin(time)*2., 1., 255.)*vec3(time/resolution, 5.), 5.);
	
	gl_FragColor = vec4(255. ,color);

}