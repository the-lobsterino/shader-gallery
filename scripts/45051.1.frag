#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec3 rColor = vec3(0.1, 0.0, 0.3);
	vec3 gColor = vec3(0.0, 0.1, 0.1);
	vec3 bColor = vec3(0.0, 0.1, 0.1);
	vec3 yColor = vec3(0.1, 0.1, 0.0);

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	position = gl_FragCoord.xy * 2.0 - resolution;
	position /= min(resolution.x, resolution.y);
	
	float a = sin(position.y * 1.5 - time * 0.1) / 1.0;
	float b = cos(position.y * 1.5 - time * 0.2) / 1.0;
	float c = sin(position.x * 0.5 - time * 0.2 + 3.14) / 2.0;
	float d = cos(position.y * 1.5 - time * 0.5 + 3.14) / 2.0;
	
	float e = 2.51 / abs(position.x + a);
	float f = 0.51 / abs(position.x + b * cos(time * 0.1));
	float g = 0.51 / abs(position.y + c);
	float h = 0.51 / abs(position.x + d);
	
	vec3 color = rColor * e * rColor * f + bColor * g * h * f * 0.01;

	
	gl_FragColor = vec4(color, 1.0);

}