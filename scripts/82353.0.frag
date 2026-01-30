#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float w = 0.902;

void main(){
	vec2 position = (gl_FragCoord.xy / resolution.xy);
	position.x *= resolution.x / resolution.y;
	// Now generate wave function
	
	float time_now = time * w;	
	
	float wave_value = 190.*cos((position.x - time_now)* 20.0) * 109.*sin((position.y) * 20.0);
	//wave_value = (wave_value);
	wave_value = 1.2 - smoothstep(wave_value, sin(time)*1090., cos(time)*1900.);
	gl_FragColor = vec4(wave_value);
		
}