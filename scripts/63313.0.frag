#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void){
	vec2 a = gl_FragCoord.xy / resolution;
	if(a.x > 0.25 && a.x < 0.75 && a.y > 0.25 && a.y < 0.75) {
		gl_FragColor += vec4(vec3(0.5), 1.);
	}
	if(a.x > 0.1 && a.x < mouse.x && a.y > 0.25 && a.y < 0.75) {
		gl_FragColor += vec4(vec3(0.5), 1.);
	}
}