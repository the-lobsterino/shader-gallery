#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Data structures

struct sdfMat {
	vec3 diffuse;
};

struct sdfOut {
	sdfMat mat;
	float dist;
};

struct marchOut {
	sdfMat sdf;
	vec3 pos;
};
	
// Constants

const float FOV = 90.;
const float PI = 3.14159265;
const float EPSILON = 1e-5;
const float INF = 3.4e38;
const int MAX_STEPS = 256;
const vec3 SKY_COLOR = vec3(0., .5, .75);

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

sdfOut sdfIntersect (sdfOut a, sdfOut b) {
	bool aIsMax = a.dist > b.dist;
	if (aIsMax) { // Ternary operator not allowed for structs
		return a;
	} else {
		return b;
	}
}

// SDF objects

sdfOut sdfPlane ( sdfMat mat, vec3 position, vec3 normal) {
	return sdfOut(mat, dot(position, normal));
}

sdfOut sdfSphere ( sdfMat mat, vec3 position, float radius) {
	return sdfOut(mat, length(position) - radius);
}

sdfOut sdfBox (sdfMat mat, vec3 position, vec3 bound) {
	return sdfOut(mat, length(max(abs(position)-bound, 0.)));
}

// SDF scene

sdfOut sceneSDF(vec3 pos) {
	vec3 checkerColor = vec3(abs(step(sin(pos.x), 0.) - step(sin(pos.z), 0.)));
	sdfMat checkerMat = sdfMat(checkerColor);
	return 
	sdfUnion(
		sdfUnion(
			sdfPlane(
				checkerMat, 
				pos, vec3(0., 1., 0.)
			),
			sdfSphere(
				sdfMat(vec3(1., 0., 0.)),
				pos - vec3(0., 3., 5.),
				2.
			)
		),
		sdfBox(
			sdfMat(vec3(0., 1., 1.)),
			rotY(time)*(pos - vec3(3., 2., -6.)),
			vec3(1., .5, 1.)
		)
	);
}

// Marching

marchOut march( vec3 pos, vec3 dir ) {
	float depth = 0.;
	float dist = EPSILON;
	sdfMat sdf;
	for (int i = 0; i < MAX_STEPS; i++) {
		sdfOut currHit = sceneSDF(pos);
		if (currHit.dist < EPSILON) {
			sdf = currHit.mat;
			break;
		}
		pos += normalize(dir) * currHit.dist;
		depth += currHit.dist;
	}
	return marchOut(sdf, pos);
}

vec3 calcNormal( vec3 pos ) {
	return normalize(
		vec3(
			sceneSDF(vec3(pos.x + EPSILON, pos.y, pos.z)).dist - sceneSDF(vec3(pos.x - EPSILON, pos.y, pos.z)).dist,
			sceneSDF(vec3(pos.x, pos.y + EPSILON, pos.z)).dist - sceneSDF(vec3(pos.x, pos.y - EPSILON, pos.z)).dist,
			sceneSDF(vec3(pos.x, pos.y, pos.z + EPSILON)).dist - sceneSDF(vec3(pos.x, pos.y, pos.z - EPSILON)).dist
		)
	);
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
	
vec3 phongLight(marchOut march, vec3 cameraPos) {
	vec3 normal = calcNormal(march.pos);
	pointLight lights[NUM_LIGHTS];
	lights[0] = pointLight(
		vec3(0., 10., 0.),
		vec3(1.),
		5.
	);
	for (int i = 0; i < NUM_LIGHTS; i++) {
		pointLight light = lights[i];
		vec3 lightDir = normalize(light.position - march.pos);
		vec3 cameraDir = normalize(cameraPos - march.pos);
		vec3 reflectDir = normalize(reflect(-lightDir, normal));
		
	}
	return normal;
}

// Main function

void main( void ) {
	
	vec3 cameraRot = vec3(
		(mouse.y - .5) * PI, 
		(.5 - mouse.x) * 2. * PI, 
		0.
	);
	vec3 cameraPos = vec3(
		0.,
		3.,
		0.
	);
	
	vec2 rawUVPos = gl_FragCoord.xy / resolution;
	vec2 rawScreenPos = (rawUVPos - 0.5) * 2.;
	float screenMin = min(resolution.x, resolution.y);
	vec2 screenMult = vec2(resolution.x / screenMin, resolution.y / screenMin);
	vec2 screenPos = rawScreenPos * screenMult;
	vec3 localCastDir = normalize(vec3(screenPos, 1. / tan(radians(FOV / 2.))));
	vec3 castDir = 
		rotY(cameraRot.y)*
		rotX(cameraRot.x)*
		rotZ(cameraRot.z)*
		localCastDir;
	
	marchOut march = march(cameraPos, castDir);
	vec3 color = phongLight(march, cameraPos);
	
	gl_FragColor = vec4(color, 1.0);
}