precision highp float;
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
// uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const int iterations = 12;
const float pi = 3.14159265359;
const float root_radius = 0.01;

const int number_roots = 15;
vec2 roots[number_roots];
vec2 roots_derive[number_roots];

float sigmoid(float x) {
    return 1.0 / (1.0 + exp(-x));
}
 
float sinc(float x) {
    return sin(pi * x);
}
 
float cosc(float x) {
	return cos(pi * x);
}

void compute_derivative_roots() {
    for (int i = 0; i < number_roots - 1; i++) {
        roots_derive[i] = float(number_roots - i - 1) * roots[i];
    }
}
 
vec2 cmul(vec2 a, vec2 b) {
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

vec2 cdiv(vec2 a, vec2 b) {
    float denom = dot(b, b);
    return (a.xy * b.yx - a.yx * b.xy) / denom;
}

// The polynomial in the C space
vec2 poly(vec2 x) {
    vec2 result = vec2(1.0, 0.);
    for (int i = 0; i < number_roots; i++) {
	    result = cmul(result, (x - roots[i]));
    }
    return result;
}

// The polynomial derivative in the C space
vec2 poly_d(vec2 x) {
    vec2 result = vec2(1.0, 0.);
    for (int i = 0; i < number_roots - 1; i++) {
	    result = cmul(result, (x - roots_derive[i]));
    }
    return result;
}

/*
1/x = conjugate(x)​ / |x]^2
*/
vec2 cinv(vec2 z) {
    float mag2 = dot(z, z);
    vec2 cz = vec2(z.x, -z.y); // Conjugate of z

    return cz / mag2;
}

/*
P′(x)/P(x)= 1/(x−x1) + 1/(x−x2) + ... + 1/(x−xn)
*/
vec2 p_pprime(vec2 x) {
    vec2 result = vec2(0., 0.);
    for (int i = 0; i < number_roots; i++) {
	    // For now cinv(x - roots[i]) is overflowing...
	    result += cinv(x - roots[i]);
    }
    return result;
}

// TODO - For now, the p_pprime is 
vec2 newton(vec2 x) {
	return x - cinv(p_pprime(x));
}

vec3 hsvToRgb(vec3 hsv) {
    float hue = hsv.x;
    float saturation = hsv.y;
    float value = hsv.z;

    float c = value * saturation;
    float x = c * (1.0 - abs(mod(hue * 6.0, 2.0) - 1.0));
    float m = value - c;

    vec3 rgb;

    if (hue < 1.0 / 6.0) {
        rgb = vec3(c, x, 0.0);
    } else if (hue < 2.0 / 6.0) {
        rgb = vec3(x, c, 0.0);
    } else if (hue < 3.0 / 6.0) {
        rgb = vec3(0.0, c, x);
    } else if (hue < 4.0 / 6.0) {
        rgb = vec3(0.0, x, c);
    } else if (hue < 5.0 / 6.0) {
        rgb = vec3(x, 0.0, c);
    } else {
        rgb = vec3(c, 0.0, x);
    }

    return rgb + m;
}


vec4 rainbowPalette(float value) {

    vec3 c = hsvToRgb(vec3(value, 1.0, 1.0));
    return vec4(c.x, c.y, c.z, 1.0); // Set alpha to 1.0 for full opacity
}

 
void main( void ) {
	vec4 vgaColors[16];
	
	vgaColors[0] = vec4(0.0, 0.0, 0.0, 1.0);        // Black
/*	
	vgaColors[1] = vec4(1.0, 0.25, 0.25, 1.0);      // Red
	vgaColors[2] = vec4(0.25, 0.25, 1.0, 1.0);      // Blue
	vgaColors[3] = vec4(0.0, 0.5, 0.0, 1.0);        // Green
	vgaColors[4] = vec4(1.0, 1.0, 0.25, 1.0);      // Yellow
	vgaColors[9] = vec4(0.0, 0.0, 0.5, 1.0);        // Navy
	vgaColors[5] = vec4(0.0, 0.5, 0.5, 1.0);        // Teal
	vgaColors[6] = vec4(0.5, 0.0, 0.0, 1.0);        // Maroon
	vgaColors[7] = vec4(0.5, 0.0, 0.5, 1.0);        // Purple
	vgaColors[8] = vec4(0.5, 0.25, 0.0, 1.0);       // Olive
	vgaColors[4] = vec4(0.5, 0.5, 0.5, 1.0);        // Light Gray
	vgaColors[10] = vec4(0.25, 0.25, 0.25, 1.0);     // Dark Gray
	vgaColors[11] = vec4(0.25, 1.0, 0.25, 1.0);     // Light Green
	vgaColors[12] = vec4(0.25, 1.0, 1.0, 1.0);      // Light Cyan
	vgaColors[13] = vec4(1.0, 0.25, 1.0, 1.0);      // Magenta
*/	
	vgaColors[15] = vec4(1.0, 1.0, 1.0, 1.0);       // White
	
	for (int i = 0; i < number_roots; i ++) {
		vgaColors[i+1] = rainbowPalette(float(i)/8.);
	}
	
	
	const vec4 black = vec4(0.0, 0.0, 0.0, 0.0); // black
	const vec4 white = vec4(1.0, 1.0, 1.0, 1.0); // white

	vec2 position = ( gl_FragCoord.xy ) / resolution.xy + surfacePosition + vec2(-.5, -.5);
	float ratio = resolution.x / resolution.y;
 	position.x *= ratio;
	
	float t = time + 1.;
	
	gl_FragColor = black;
	
	for (int i = 0; i < number_roots; i++) {
		float f = float(i) + 1.;
		f *= 0.01;
		roots[i] = vec2( cosc(mouse.x * t * f), sinc(mouse.y * t * f) );
		float l = length(position - roots[i]);
		
		// Show the roots
		if (l < root_radius) {
			gl_FragColor = vgaColors[i+1];
			return;
		}
	}	
	
	if (length(position) < root_radius) {
		gl_FragColor = black;
		return;
	}
	
	compute_derivative_roots();

	vec2 p = position;
	for (int iter = 0; iter < iterations; iter++) {
		p = newton(p);			
	}				
 
	float min_l = 1e50;
	float dist[3];
	for (int i=0; i < number_roots; i++) {
		float l = length(position - roots[i]);
		float lp = length(p - roots[i]);
		
		if (l < root_radius) {
			gl_FragColor = vgaColors[i+1];
			return;
		}
		
		if (min_l > lp) {
			min_l = lp;
			gl_FragColor = vgaColors[i+1] * .7;
		} 
	}
}