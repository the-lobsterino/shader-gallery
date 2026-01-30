#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//created 1/15/2015 by alex booth

const vec3 sky_top_color = vec3(34.0/255.0, 34.0/255.0, 88.0/255.0);
const vec3 sky_bot_color = sky_top_color; 

const vec3 hill_1_color = vec3(038.0/255.0, 076.0/255.0, 163.0/255.0);
const vec3 hill_2_color = vec3(046.0/255.0, 127.0/255.0, 169.0/255.0);
const vec3 hill_3_color = vec3(096.0/255.0, 130.0/255.0, 135.0/255.0); 
const vec3 hill_4_color = vec3(081.0/255.0, 42.0/255.0, 148.0/255.0); 
void main(void) {
	vec2 pos = (gl_FragCoord.xy / resolution.xy);

	float hill_1 = 0.060*sin(pos.x*10.0+time*0.100)*sin(time*0.10)+0.55;
	float hill_2 = 0.075*sin(pos.x*6.0-time*0.090)*sin(time*0.18)+0.45;
	float hill_3 = 0.100*sin(pos.x*3.0+time*0.095)*sin(time*0.27)+0.30;
	float hill_4 = 0.040*sin(pos.x*14.0+time*0.130)*sin(time*0.02)+0.60;
	
	//sky, far, middle, and closest
	vec3 color = mix(sky_bot_color, sky_top_color, smoothstep(hill_4, 1.0, pos.y));

	color = mix(color, hill_4_color, smoothstep(hill_4 + 0.02, hill_4, pos.y));
	color = mix(color, hill_1_color, smoothstep(hill_1 + 0.01, hill_1, pos.y));
	color = mix(color, hill_2_color, smoothstep(hill_2 + 0.01, hill_2, pos.y));
	gl_FragColor = vec4(mix(color, hill_3_color, smoothstep(hill_3 + 0.004, hill_3, pos.y)), 1.0);
}