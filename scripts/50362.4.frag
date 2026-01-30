#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv(float h, float s, float v) {
	vec3 K = vec3(1.0, 2.0 / 3.0, 1.0 / 3.0);
	vec3 p = clamp(abs(fract(vec3(h) + K.xyz) * 6.0 - vec3(3.0)) - vec3(1.0), 0.0, 1.0);
	return v * mix(vec3(1.0), p, s);
}

vec3 hsl(float h, float s, float l) {
	float newS = s * (1.0 - abs(1.0 - 2.0 * l)) / 2.0;	
	return hsv(h, 2.0 * newS / (l + newS), l + newS);
}


void main(void) {
	vec2 p = gl_FragCoord.xy / resolution;

	float X = (p.x) * 3.0;
	float Y = (1.0 - p.y) * 2.0;

	float x = (mod(X, 1.0) - 0.5) * 2.1 * 2.0 * resolution.x / 3.0 / resolution.y;
	float y = (mod(Y, 1.0) - 0.5) * 2.1;
	float a = atan(y, x);
	float r = length(vec2(x, y));

	float h = a / 2.0 / 3.141592;

	if(r < 0.6) {
		h = floor(h * 12.0 + 0.5) / 12.0;
	} else if(r < 0.8) {
		h = floor(h * 24.0 + 0.5) / 24.0;
	}

	if(X > 1.0) {
		if(X > 2.0) {
			h -= sin(h * 3.0 * 2.0 * 3.141592) * 0.025;
		}
		h *= 6.0;
		float x = mod(h, 1.0);
		h = floor(h) + x * x * (3.0 - 2.0 * x);
		h /= 6.0;
	}
	
	float l = 0.5;
	
//	vec3 c = hsl(h, 1.0, mod(y, 1.0));
	vec3 c = hsl(h, 1.0, l);

	if(Y > 1.0) {
		c = pow(c, vec3(1.0 / 2.2));
	}

	float stripes =
		step(-r, -0.29) * step(r, 0.31) +
		step(-r, -0.59) * step(r, 0.61) +
		step(-r, -0.79) * step(r, 0.81) +
		step(-r, -0.99) * step(r, 1.01) +
		step(mod(a * 12.0 / 2.0 / 3.141592 + 0.5 + 0.04, 1.0), 0.08) * step(r, 0.6) * step(-r, -0.3)+
		step(mod(a * 24.0 / 2.0 / 3.141592 + 0.5 + 0.05, 1.0), 0.10) * step(r, 0.8) * step(-r, -0.6);
	c *= step(-r, -0.4) * step(-1.0, -r) * (1.0 - stripes);
	//c += vec3(stripes);
	gl_FragColor = vec4(c, 1.0);
}
