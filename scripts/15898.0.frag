#ifdef GL_ES
precision lowp float;
#endif



uniform vec2 mouse;
uniform vec2 resolution;

uniform float time;
#define PI 3.1414159265359
#define M  0.9
#define D  0.6


void main(){

 	vec2 p = (mouse);

	vec3 c = vec3(0);

	c += 0.0015 / (length(p)) * vec3(1., 0.6, 0);


	gl_FragColor = vec4(c, 1);
}