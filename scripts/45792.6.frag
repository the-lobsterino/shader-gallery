#ifdef GL_ES
precision mediump float;
#endif

//________________PotatoAim101_____________________

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 cercle (vec2 x, vec2 y) {
	return (x*x + y*y);
}

void main( void ) {
	float r, g, b;
	vec2 x = gl_FragCoord.x/resolution * 5.0;
	vec2 y = gl_FragCoord.y/resolution * 5.0;
	vec3 c = vec3 (cercle (x, y), 0.0);
	vec3 color = vec3 (c);
	gl_FragColor = vec4 (.8, color);
}