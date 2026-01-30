#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
vec3 color;
	color.r =  1.0 - (pow(uv.x - 0.33,2.0) + pow(uv.y - 0.33,2.0))*9.0;
	color.g =  1.0 - (pow(uv.x - 0.50,2.0) + pow(uv.y - 0.66,2.0))*9.0;
	color.b =  1.0 - (pow(uv.x - 0.66,2.0) + pow(uv.y - 0.33,2.0))*9.0;
	

	gl_FragColor = vec4(color, 0.5 );

}
