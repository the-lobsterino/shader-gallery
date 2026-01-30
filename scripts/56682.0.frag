#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(){
	vec2 center = resolution * 0.5;
	
	vec4 color = vec4(0.0);
	
	float dist = length(gl_FragCoord.xy - center);
	float size = 50.0;
	
	color += size/dist;
	
	float trsh = mouse.x / 1.0;
	color = smoothstep(0.5 - trsh, 0.5 + trsh, color);
	
	
	gl_FragColor = color;
}