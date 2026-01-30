precision highp float;
 
uniform float time;
// uniform vec2 mouse;
uniform vec2 resolution;
// uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const int iterations = 10;
const float pi = 3.14159265359;
const float root_radius = 0.01;

const int number_roots = 4;
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
 
void main( void ) {
	vec4 vgaColors[16];
	vgaColors[0] = vec4(0.0, 0.0, 0.0, 1.0);        // Black
	vgaColors[1] = vec4(1.0, 0.25, 0.25, 1.0);     // Red
	vgaColors[2] = vec4(0.25, 0.25, 1.0, 1.0);      // Blue
	vgaColors[3] = vec4(0.0, 0.5, 0.0, 1.0);        // Green
	
	vgaColors[4] = vec4(0.0, 0.0, 0.5, 1.0);        // Navy
	vgaColors[5] = vec4(0.0, 0.5, 0.5, 1.0);        // Teal
	vgaColors[6] = vec4(0.5, 0.0, 0.0, 1.0);        // Maroon
	vgaColors[7] = vec4(0.5, 0.0, 0.5, 1.0);        // Purple
	vgaColors[8] = vec4(0.5, 0.25, 0.0, 1.0);       // Olive
	vgaColors[9] = vec4(0.5, 0.5, 0.5, 1.0);        // Light Gray
	vgaColors[10] = vec4(0.25, 0.25, 0.25, 1.0);     // Dark Gray
	vgaColors[11] = vec4(0.25, 1.0, 0.25, 1.0);     // Light Green
	vgaColors[12] = vec4(0.25, 1.0, 1.0, 1.0);      // Light Cyan
	vgaColors[13] = vec4(1.0, 0.25, 1.0, 1.0);      // Magenta
	vgaColors[14] = vec4(1.0, 1.0, 0.25, 1.0);      // Yellow
	vgaColors[15] = vec4(1.0, 1.0, 1.0, 1.0);       // White
	
	const vec4 black = vec4(0.0, 0.0, 0.0, 0.0); // black
	const vec4 white = vec4(1.0, 1.0, 1.0, 1.0); // white

	vec2 position = ( gl_FragCoord.xy ) / resolution.xy + surfacePosition;
	float ratio = resolution.x / resolution.y;
 	position.x *= ratio;
	
	float t = time + 1.;
	
	gl_FragColor = black;
	
	for (int i = 0; i < number_roots; i++) {
		float f = float(i) + 1.;
		f *= 0.005;
		roots[i] = .5 * vec2( cosc(3. * t * f), sinc( 7. * t * f) );
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