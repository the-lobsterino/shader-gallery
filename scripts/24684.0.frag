precision mediump float;

float add(float a, float b) {
	return a + b;
}

void main() {
	float r = 1.0;
	float g = 0.5;
	float b = 0.8;
	
	r = add(0.2, 0.6);
	
	vec4 color = vec4(r, g, b, 1.0);
	gl_FragColor = color;
}