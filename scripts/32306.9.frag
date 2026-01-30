#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1

//http://glslsandbox.com/e#32305.0
void main( void ) {

	float t = time*0.25;
	float a = mouse.x/mouse.y; // 0.122
	float b = resolution.y*0.5;
	float l = 5.0*(1.-cos(mouse.y*PI+t)*2.+1.)+0.1;
	vec4 c1 = vec4(1.0,1.0,1.0,1.0);
	vec4 c2 = vec4(0.0,1.0,0.0,1.0);
	float v = (gl_FragCoord.y - (sin(gl_FragCoord.x/a+t)*b+resolution.y/2.0));
	float m = mix(1.-smoothstep(v,-v,l),step(abs(v),l),sin(t*5.));
	gl_FragColor = vec4(mix(vec4(0.0),mix(c1,c2,step(v,1.)),m));
}
