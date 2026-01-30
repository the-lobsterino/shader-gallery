#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 p = vec2(gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y);
	
	vec3 white = vec3(1,1,1);
        vec3 red = vec3(1, 0, 0);
        vec3 green = vec3(0, 1, 0);
        vec3 blue = vec3(0, 0, 1);
        vec3 black = vec3(0, 0, 0);
	
	float x = -1.5 * mouse.x + p.x * 3.0;
	float y = -1.5 * mouse.y + p.y * 3.0;
	float c = floor(x * x + y * y);
	
	vec3 cor =  vec3(1.0-c, 0, 0);
	
	gl_FragColor = vec4(cor,1);
	
}