#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float w = 0.02;

void main(){
	vec2 position = (gl_FragCoord.xy / resolution.xy);
	// Now generate wave function
	
	float time_now = time * w;	
	
	float wave_value = cos((position.x - time_now)* 250.0) * sin((position.y) * 250.0);
	wave_value = (wave_value);
	
	gl_FragColor = vec4(wave_value);
		
}