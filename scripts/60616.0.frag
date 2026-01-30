#ifdef GL_ES
precision mediump float;
#endif

// My own style with some hand crafted formular. ;-)
// -- novalis 

//This is a wave equation, for simulating the surface of the water during a splash, by Luke Rex de Vries
//Most of the time there would be a time variable that would lower the magnitude by the amount of time since the collision with the water's surface occured,
//But that is not possible within GLSL Sandbox as far as I know
// tevs
uniform float time;
varying vec2 surfacePosition;

void main(void) {
	vec2 uv = surfacePosition;
	uv *= vec2(20., 2.);
	
	float t = mod(time, 5.);
	float height = sin(uv.x/t/2.)/uv.x*t*2.*exp(-t)*-sin(t*5.);
	
	float wave = smoothstep(0., 0.02, height-min(uv.y, 1.));
	
	vec3 color = vec3(.3, .5, 1.)*wave;
	
	gl_FragColor = vec4(color, 1);
}