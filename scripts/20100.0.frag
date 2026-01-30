
precision mediump float;

uniform vec2 mouse;
uniform vec2 resolution;

uniform float time;
varying vec2 surfacePosition;

void main(void) {
	float intensity = 20.0; // Lower number = more 'glow'
	vec2 offset = 0.5-mouse;//vec2(0 , 0); // x / y offset // mouse coordinate still not valid?
	float wideScreenProblem = resolution.x / resolution.y; // get the ratio of width and height pixels
	offset *= vec2( wideScreenProblem,1.0 ); // apply it to current vec
	vec3 light_color = vec3(0.2, 0.14, 0.1); // RGB, proportional values, higher increases intensity
  	float master_scale = pow(10.0, sin(time*8.0)) * 0.1; // Change the size of the effect
	float c = master_scale/(length(surfacePosition+offset));
	
	
	gl_FragColor = vec4(vec3(c) * light_color, 0.1);
}