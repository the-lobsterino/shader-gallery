#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(float seed) {
	return sin(seed * seed * time - seed * seed) / seed + cos(seed * time) * 10.0;
}

float rnpf(float x) {
	if(rand(x) <= 0.5) {
		return 1.0;
	}
	return -1.0;
}

bool req(float a, float b, float h) {
	return (a - h < b && a + h > b);
}

bool axis(vec2 p) {
	if(req(p.x, resolution.x / 2.0, 0.1) || req(p.y, resolution.y / 2.0, 0.1)) {
		return true;
	}
	
	return false;
}

float f(float x) {
	return 10.0 * sin(x);	
}

void main() {
    // Assuming u_resolution is a uniform containing the screen resolution
    vec2 pixelCoord = gl_FragCoord.xy;

    // Calculate the y-coordinate of the sine wave
    float y = f(pixelCoord.x - resolution.x / 2.0) + resolution.y / 2.0;

    // Set the color based on whether the pixel is part of the sine wave
    if(abs(pixelCoord.y - y) < 1.0 || axis(pixelCoord)) {
        // Pixel is part of the sine wave, set color to white
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // White color
    } else {
        // Pixel is not part of the sine wave, set color to black
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black color
    }
}

