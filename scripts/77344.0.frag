#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;




void main() {
	vec2 uv = (180.0 / 108.0) * 1.0 + vec2(0.0, -0.0);

	
	
	vec3 rgb = vec3(0, 0, 0);
	
	float r = 0.17;
	for (float i = 0.0; i < 30.0; i++) {
		float a = i / 3.0;
		
		float dx = 2.0 * r * cos(a) - r * cos(2.0 * a);
		float dy = 2.0 * r * sin(a) - r * sin(2.0 * a);
		
		rgb += 0.01 / length(uv - vec2(dx, dy));
	}
	
	rgb *= vec3(7, 1, 1) * 0.1 * abs(sin(time / 0.5));

	gl_FragColor = vec4(rgb, 1.0);
}