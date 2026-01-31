#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.141592;

void main( void ) {
	float t = 0.1;

	vec2 position = (gl_FragCoord.xy / resolution.xy);
	vec4 baseColor = vec4(1.0, 0.0, 0.0, 1.0);
	vec3 glowColor = vec3(1.0);
	
	float progress = 0.5;
	
	float factor = -(PI * progress) + position.x * PI;
	factor *= 10.0;
	factor = clamp(factor + PI - PI * progress, 0.0, PI);

        vec3 gradient = vec3(sin(factor));

	gl_FragColor = vec4(gradient, 1.0);
}