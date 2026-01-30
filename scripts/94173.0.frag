#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float round(vec2 center, vec2 size, float radius) {
	return length(max(abs(center) - size + radius, 0.0)) - radius;
}

void main() {
	vec2 size = vec2(300.0, 300.0);
	float radius = (sin(time) + 1.0) * 150.0;
	
	float rounded = round(gl_FragCoord.xy - size, size, radius);
	float smoothed = 1.0 - smoothstep(0.0, 2.0, rounded);
	
	vec4 quadColor = mix(vec4(1.0, 1.0, 1.0, 1.0), vec4(0.1, 0.5, 1.0, smoothed), smoothed);
  
	gl_FragColor = quadColor;
}