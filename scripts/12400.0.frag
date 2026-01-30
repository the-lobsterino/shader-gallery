#ifdef GL_ES
precision mediump float;
#endif

float Scale = 1.0;
float minRadius2 = 0.1;
int Iterations = 5;
int colorIterations = 5;

float fixedRadius2 = 3.0;

float foldingLimit = 1.0;
vec4 pointLightPos = vec4(5,0,-10,1);
vec4 orbitTrap = vec4(1000,1000,1000,1);

void sphereFold(inout vec3 z, inout float dz) {
	float r2 = dot(z,z);
	if (r2<minRadius2) {
		float temp = (fixedRadius2/minRadius2);
		z *= temp;
		dz*= temp;
	} else if (r2 < fixedRadius2) {
		float temp = (fixedRadius2/r2);
		z *= temp;
		dz*= temp;
	}
}

void boxFold(inout vec3 z, inout float dz) {
	z = clamp(z, -foldingLimit, foldingLimit) * 2.0 - z;
}

float DE(vec3 z)
{
	vec3 offset = z;
	float dr = 1.0;
	for (int n = 0; n < 5; n++) {
		float r2 = dot(z.xyz,z.xyz);
		if (n < colorIterations) orbitTrap = min(orbitTrap, abs(vec4(z.xyz, r2)));
		boxFold(z,dr);
		sphereFold(z,dr);
			z = Scale*z + offset;
		dr = dr*abs(Scale)+1.0;
	}
	float r = length(z);
	return r/abs(dr);
}