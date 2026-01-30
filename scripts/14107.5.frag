#ifdef GL_ES
precision mediump float;
#endif

#define NUMBER_OF_ITERATIONS 128

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// helper function used to map x from [0,1] to interval [a,b]
float mapInterval(float x,float a,float b) {
	return x * (b - a) + a;
}
 
float lengthSquared(vec2 vec) {
	return vec.x * vec.x + vec.y * vec.y;
}

float len(vec2 vec) {
	return sqrt(lengthSquared(vec));
}

float angle(vec2 vec) {
	return atan(vec.y,vec.x);
}

vec2 toPolar(vec2 vec) {
	return vec2(len(vec),angle(vec));
}

vec2 toCartesian(vec2 vec) {
	return vec2(vec.x * cos(vec.y),
				vec.x * sin(vec.y));
}

// multiplies to complex numbers in polar form
vec2 multiplyPolar(vec2 z1, vec2 z2) {
	return vec2(z1.x * z2.x,
				z1.y + z2.y
				);
}

// returns a translated copy of a number
vec2 translate(vec2 z1, vec2 z2) {
	return vec2(z1.x + z2.x,
				z1.y + z2.y);
}

vec2 multiplyCartesian(vec2 z1,vec2 z2) {
	return vec2(z1.x * z2.x - z1.y * z2.y,z1.x * z2.y + z1.y * z2.x);
}

vec2 divide(vec2 z1, vec2 z2) {
	z1 = toPolar(z1);
	z2 = toPolar(z2);
	z1.x /= z2.x;
	z1.y -= z2.y;
	return toCartesian(z1);
}

// returns a rotated copy of a number
vec2 rotate(vec2 z, float angle) {
	vec2 result = toPolar(z);
	result.y += angle;
	return toCartesian(result);
}

// returns a scaled copy of a number
vec2 scale(vec2 z, float scale) {
	z.x *= scale;
	z.y *= scale;
	return z;
}

vec2 powComplex(vec2 z, vec2 e) {
	
	z = toPolar(z);
	
	vec2 result;
	float rc = pow(z.x,e.x);
	
	result.x = rc * exp(-e.y*z.y) * cos(e.x*z.y + e.y*log(z.x));
	result.y = rc * exp(-e.y*z.y) * sin(e.x*z.y + e.y*log(z.x));
	
	return result;
}

vec2 powComplex(vec2 z,float e) {
	return powComplex(z,vec2(e,0.0));
}

vec2 powComplex(float z,vec2 e) {
	return powComplex(vec2(z,0.0),e);
}

vec2 expComplex(vec2 z) {
	return powComplex(exp(1.0),z);
}

vec2 sinComplex(vec2 z) {
	vec2 iz = multiplyCartesian(z,vec2(0,1));
	vec2 negIz = multiplyCartesian(z,vec2(0,-1));

	vec2 negExp = scale(expComplex(negIz),-1.0);

	return divide(translate(expComplex(iz),negExp),vec2(0,2.0));
}

vec2 cosComplex(vec2 z) {
	vec2 iz = multiplyCartesian(z,vec2(0,1));
	vec2 negIz = multiplyCartesian(z,vec2(0,-1));
	return scale(translate(expComplex(iz),expComplex(negIz)),0.5);
}

vec2 tanComplex(vec2 z) {
	return divide(sinComplex(z),cosComplex(z));
}

vec2 sinhComplex(vec2 z) {
	vec2 negExp = scale(expComplex(z),-1.0);

	return scale(translate(expComplex(z),negExp),0.5);
}

vec2 coshComplex(vec2 z) {
	return scale(translate(expComplex(z),expComplex(z)),0.5);
}

vec2 tanhComplex(vec2 z) {
	return divide(sinhComplex(z),coshComplex(z));
}



vec2 logComplex(vec2 z) {
	z = toPolar(z);
	return vec2(log(z.x),z.y);
}

vec3 coloringFunction(int iteration) {
	float t = float(iteration) / float(NUMBER_OF_ITERATIONS);

	float r = t / 00000.1;
	float b = cos(t * 14.14);
	float g = sin(t * 5.0);

	return vec3(r,g,b);
}

vec2 mappingFunction(vec2 z,vec2 c) {
		
	
	vec2 pz = multiplyCartesian(powComplex(z,2.0),logComplex(powComplex(z,5.0 + 3.0 * sin(time))));
	

	return translate(pz,c);
}


vec2 preprocessFunction(vec2 z) {

	//z = scale(z,1.0 + 0.9 * 2.0 * sin(0.3 * time));
	//z = rotate(z,time);
	
	return z;
}

bool distanceFunction(vec2 z) {
	return lengthSquared(z) >= 4.0;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	vec2 topLeft = vec2(-2.0,1.0);
	vec2 bottomRight = vec2(1.0,-1.0);

	float t = 2.0 + sin(time);


	vec2 z = vec2(mapInterval(position.x,topLeft.x,topLeft.y),
				  mapInterval(position.y,bottomRight.x,bottomRight.y));
	

	z = preprocessFunction(z);
	vec2 c = z;

	//c = vec2(-0.76,0.001);


	int iteration;
	for (int i = 0; i <= NUMBER_OF_ITERATIONS; ++i) {
		z = mappingFunction(z,c);
		iteration = i;
		if (distanceFunction(z)) {
			break;
		}
	}


	vec3 color = vec3(0.0,0.0,0.0);

	if (iteration < NUMBER_OF_ITERATIONS) {
		color = coloringFunction(iteration);
	}

	gl_FragColor = vec4(color.x, color.y, color.z, 1.0 );

}