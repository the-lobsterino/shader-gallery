
precision mediump float;

uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

varying vec2 surfacePosition;

void main( void ) {
	float intensity = 1.1; // Lower number = more 'glow'
	vec2 offset = mouse/resolution; // x / y offset
	vec2 pos = (gl_FragCoord.xy/resolution.xy-mouse.xy);
	pos.y*=resolution.y/resolution.x;
	float t=abs(sin(time));
	float t2=abs(cos(time));
	float t3 = abs(sin(time+.1));
	vec3 light_color = vec3(0.3*t2, .2*t, .8*t3); // RGB, proportional values, higher increases intensity
	float master_scale = .005; // Change the size of the effect
	float c = master_scale/(length(pos)*0.05);
	
	
	gl_FragColor = vec4(vec3(c)*light_color, 1.0)
		;
	
}