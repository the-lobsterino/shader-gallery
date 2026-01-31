#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Data structures

struct phongMat {
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
};

struct marchOut {
	phongMat mat;
	vec3 pos;
	bool hit;
};

struct sdfOut {
	phongMat mat;
	float dist;
};
	
// Lerping functions

#define defLerp(T) T lerp(T a, T b, float t) { return a*(1.0-t) + b*t;}
defLerp(float)
defLerp(vec2)
defLerp(vec3)
defLerp(vec4)

phongMat lerp(phongMat a, phongMat b, float t) {
	return phongMat(
		lerp(a.ambient, b.ambient, t),
		lerp(a.diffuse, b.diffuse, t),
		lerp(a.specular, b.specular, t)
	);
}

// Element-wise vector max doesn't work everywhere
vec3 vecmax(vec3 a, vec3 b) {
	return vec3(max(a.x, b.x), max(a.y, b.y), max(a.z, b.z));
}
	
// Constants

const float FOV = 50.;
const float PI = 3.14159265;
const float EPSILON = 1e-4;
const float INF = 3.4e38;
const int MAX_STEPS = 256;
const vec3 SKY_COLOR = vec3(0., .5, .75);
const vec3 AMBIENT_COLOR = vec3(0.);


// Translation matrices

mat3 rotX( float angle ) {
	float c = cos(angle);
	float s = sin(angle);
	return mat3(
		vec3( 1., 0.,  0.),
		vec3( 0., c , -s ),
		vec3( 0., s,   c )
	);
}

mat3 rotY( float angle ) {
	float c = cos(angle);
	float s = sin(angle);
	return mat3(
		vec3( c , 0.,  s ),
		vec3( 0., 1.,  0.),
		vec3(-s , 0.,  c )
	);
}

mat3 rotZ( float angle ) {
	float c = cos(angle);
	float s = sin(angle);
	return mat3(
		vec3( c ,-s , 0.),
		vec3( s , c , 0.),
		vec3( 0., 0., 1.)
	);
}

// SDF helpers

sdfOut sdfUnion (sdfOut a, sdfOut b) {
	bool aIsMin = a.dist < b.dist;
	if (aIsMin) { // Ternary operator not allowed for structs
		return a;
	} else {
		return b;
	}
}

sdfOut applyMat (sdfOut a, sdfOut b) {
	sdfOut u = sdfUnion(a, b);
	return sdfOut(u.mat, a.dist);
}

// SDF objects

sdfOut sdfPlane ( phongMat col, vec3 position, vec3 normal) {
	return sdfOut(col, dot(position, normal));
}

sdfOut sdfSphere ( phongMat col, vec3 position, float radius) {
	return sdfOut(col, length(position) - radius);
}

float selfDot(vec3 v) {return dot(v, v);}

sdfOut sdfRoundCone ( phongMat col, vec3 position, vec4 alpha, vec4 beta) {
	vec3 a = alpha.xyz;
	float arad = alpha.w;
	vec3 b = beta.xyz;
	float brad = beta.w;
	vec3 delta = b - a;
	float len2 = selfDot(delta);
	float radDelta = arad - brad;
	float a2 = len2 - radDelta * radDelta;
	float invLen2 = 1.0 / len2;
	
	vec3 posa = position - a;
	float y = dot(delta, posa);
	float z = y - len2;
	float x2 = selfDot(posa * len2 - delta * y);
	float y2 = y*y*len2;
	float z2 = z*z*len2;
	
	float k = sign(radDelta) * radDelta * radDelta * x2;
	float dist;
	if (sign(z)*a2*z2 > k) {dist = sqrt(x2 + z2) * invLen2 - brad;}
	else if (sign(y)*a2*y2 < k) {dist = sqrt(x2 + y2) * invLen2 - arad;}
	else {dist = (sqrt(x2*a2*invLen2) + y * radDelta) * invLen2 - arad;}
	return sdfOut(col, dist);
}

// SDF scene

sdfOut sceneSDF(vec3 pos) {
	sdfOut o = sdfPlane(
		phongMat(vec3(0.), vec3(0.), vec3(0.0)), 
		pos, vec3(0, 1., 7.)
	);
	phongMat red = phongMat(vec3(0.), vec3(.815, .333, .411), vec3(1.)); 
	phongMat blue = phongMat(vec3(0.), vec3(.309, .627, .761), vec3(1.)); 
	phongMat yellow = phongMat(vec3(.984, .815, .435) * 0.2, vec3(.984, .815, .435) * 0.8, vec3(0.)); 
	phongMat black = phongMat(vec3(0.), vec3(.1), vec3(0.1));
	o = sdfUnion(o,
		sdfSphere(
			red,
			(pos - vec3(5., 3.5, 0.)) / vec3(1., .65, 1.),
			.8
		)
	);
	o = sdfUnion(o,
		sdfRoundCone(
			red,
			pos,
			vec4(5., 3.6, 0., .25),
			vec4(5., 4.4, 0., .1)
		)
	);
	vec3 p = vec3(pos.x, pos.y * .75, abs(pos.z)) - vec3(4.4, 2.67, 0.5);
	o = applyMat(o,
		sdfSphere(
			yellow,
			p,
			.2
		)
	);
	o = applyMat(o,
		sdfSphere(
			black,
			p,
			.15
		)
	);
	o = applyMat(o,
		sdfSphere(
			yellow,
			p,
			.12
		)
	);
	o = applyMat(o,
		sdfSphere(
			black,
			p,
			.06
		)
	);
	o = sdfUnion(o,
		sdfRoundCone(
			blue,
			pos / vec3(1., 1., 1.6),
			vec4(5., 3.4, 0., .3),
			vec4(3.7, 3.4, 0., .1)
		)
	);
	o = sdfUnion(o,
		sdfSphere(
			red,
			(pos - vec3(5., 2.15, 0.)) / vec3(1., 1.3, 1.),
			.6
		)
	);
	o = applyMat(o,
		sdfSphere(
			blue,
			(rotZ(.4) * (pos - vec3(5., 2.35, 0.))) / vec3(1., .5, 1.),
			.8
		)
	);
	o = sdfUnion(o,
		sdfRoundCone(
			blue,
			(pos - vec3(5, 0, 0)) / vec3(.7, 1, 1.2) + vec3(5, 0, 0),
			vec4(5, 1.15, 0, 0.125),
			vec4(5.2, 0.2, 0, 0.25)
		)
	);
	o = sdfUnion(o,
		sdfRoundCone(
			blue,
			vec3(pos.x, pos.y, abs(pos.z)) / vec3(1, .6, .85),
			vec4(vec3(5, 4.2, .6), 0.15),
			vec4(vec3(5.2, 3.1, 1.8), 0.3)
		)
	);
	return o;
}

// Marching

vec3 calcNormal( vec3 pos ) {
	float distHere = sceneSDF(vec3(pos.x, pos.y, pos.z)).dist;
	return normalize(
		vec3(
			sceneSDF(vec3(pos.x + EPSILON, pos.y, pos.z)).dist - distHere,
			sceneSDF(vec3(pos.x, pos.y + EPSILON, pos.z)).dist - distHere,
			sceneSDF(vec3(pos.x, pos.y, pos.z + EPSILON)).dist - distHere
		)
	);
}

marchOut march( vec3 pos, vec3 dir) {
	float depth = 0.;
	float dist = INF;
	for (int i = 0; i < MAX_STEPS; i++) {
		sdfOut currHit = sceneSDF(pos);
		if (currHit.dist < EPSILON) {
			return marchOut(currHit.mat, pos, true);
		}
		pos += normalize(dir) * currHit.dist;
		depth += currHit.dist;
		dist = currHit.dist;
	}
	return marchOut(phongMat(vec3(0), vec3(0), vec3(0)), pos, false);
}

vec3 normalRawToColor(vec3 normal) {
	return (normal / 2.) + .5;
}

// Phong illumination

struct pointLight{
	vec3 position;
	vec3 color;
	float intensity;
};

const int NUM_LIGHTS = 1;
const float AMBIENT_FLOOR = 0.25;

// Using a directional light

vec3 phongLight(marchOut mOut, vec3 cameraPos) {
	vec3 outColor = mOut.mat.ambient;
	pointLight lights[NUM_LIGHTS];
	lights[0] = pointLight(
		vec3(-15., 50., 0),
		vec3(1., 1., 1.),
		15. * mouse.y
	);
	vec3 normal = calcNormal(mOut.pos);
	for (int i = 0; i < NUM_LIGHTS; i++) {
		pointLight light = lights[i];
		vec3 lightDir = normalize(mOut.pos - light.position);
		//float hit = distance(march(light.position, lightDir).pos, mOut.pos) > EPSILON*10. ? 0.0 : 1.0;
		vec3 cameraDir = normalize(cameraPos - mOut.pos);
		float lightIntensity = max(dot(-lightDir, normal), 0.0);
		lightIntensity *= 1. / pow(distance(light.position, mOut.pos) * 0.1, 2.);
		lightIntensity *= light.intensity;
		vec3 reflectDir = reflect(lightDir, normal);
		float specularity = pow(max(dot(cameraDir, reflectDir), 0.0), 20.0);
		float hit = lightIntensity * (1. - AMBIENT_FLOOR) + AMBIENT_FLOOR * min(1.0, mouse.y * 5.);//max(min(hit, lightIntensity), AMBIENT_FLOOR);
		vec3 rawColor = (mOut.mat.diffuse + mOut.mat.specular * specularity) * hit;
		outColor += light.color * (vecmax(vec3(0.), rawColor));
	}
	return outColor;
}

// Main function

void main( void ) {
	float screenMin = min(resolution.x, resolution.y);
	vec2 screenMult = vec2(resolution.x / screenMin, resolution.y / screenMin);
	
	vec3 cameraRot = vec3(
		-.3 + (mouse.y - .5) * 0.3, 
		-PI * .5 - sin((mouse.x - .5) * 2.), 
		0.
	);
	vec3 cameraPos = vec3(
		.3,
		4.,
		(mouse.x - .5) * 8.
	);
	
	vec2 rawUVPos = gl_FragCoord.xy / resolution;
	vec2 rawScreenPos = (rawUVPos - 0.5) * 2.;
	vec2 screenPos = rawScreenPos * screenMult;
	vec3 localCastDir = normalize(vec3(screenPos, 1. / tan(radians(FOV / 2.))));
	vec3 castDir = 
		rotY(cameraRot.y)*
		rotX(cameraRot.x)*
		rotZ(cameraRot.z)*
		localCastDir;
	castDir = vec3(castDir.x, castDir.y, castDir.z);
	
	vec3 color = phongLight(march(cameraPos, castDir), cameraPos);
	
	gl_FragColor = vec4(color, 1.0);
}