#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float loop() {
	// return abs(fract(time) - 0.5)*2.0;
	// return (sin(time) + 1.0) / 2.0;
	return time / 4.0;
}

float xor(float a, float b) {
	float x = 0.0;
	
	for (float n = 16.0; n >= 0.0; n -= 1.0) {
		float s = pow(2.0, n);
		
		if((s < a) ^^ (s < b)) {
			x += s;
		}
		if (s < a) {
			a -= s;
		}
		if (s < b) {
			b -= s;
		}	
	}
	
	return x;
}

void main( void ) {
	float w = resolution.x;
	float h = resolution.y;
	float s = min(w, h);
	float sx = (w - s) / 2.0;
	float sy = (h - s) / 2.0;
	
	float posx = (gl_FragCoord.x - sx) / s;
	float posy = (gl_FragCoord.y - sy) / s;

	vec2 pos = vec2( posx, posy );
	float color = 0.0;
	
	if(0.0 <= pos.x && pos.x <= 1.0 && 0.0 <= pos.y && pos.y <= 1.0) {
	
		float z = fract(time);
		float x = floor(((pos.x - 0.5) / (z + 1.0) + 0.5) * 256.0);
		float y = floor(((pos.y - 0.5) / (z + 1.0) + 0.5) * 256.0);
		float r = xor(x, y) / 256.0;
		
		float x1 = floor(((pos.x - 0.5) / (z + 1.0) / 2.0 + 0.5) * 256.0);
		float y1 = floor(((pos.y - 0.5) / (z + 1.0) / 2.0 + 0.5) * 256.0);
		float r1 = xor(x1, y1) / 256.0;
		
		color = mix(r1, r, z); // fract(r + loop());
	}

	gl_FragColor = vec4(vec3(color), 1.0);
}