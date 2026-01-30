#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


const vec3 rayDir = vec3(0,0,1);
const vec3 sphereCenter = vec3(0.5,0.5,1);
const float sphereRadius = 0.5;

struct MaybeVec3 {
	bool isNull;
	vec3 value;
};
MaybeVec3 nullMaybeVec() {
	MaybeVec3 res;
	res.isNull = true;
	return res;
}
MaybeVec3 vec3MaybeVec(vec3 val) {
	MaybeVec3 res;
	res.isNull = false;
	res.value = val;
	return res;
}

MaybeVec3 sphereIntersect(vec3 rayOrig) {
	vec3 centerToOrig = rayOrig - sphereCenter;
	float rayDirDotCenterToOrig = dot(rayDir, centerToOrig);
	//solving sphere intersection equation
	float determinant = 
		rayDirDotCenterToOrig*rayDirDotCenterToOrig - 
		dot(centerToOrig, centerToOrig) + 
		sphereRadius * sphereRadius;
	
	if(determinant < 0.0) {
		return nullMaybeVec();
	} 
	else {
		float scalarProjectionOfCenterToOrigOverRayDir = rayDirDotCenterToOrig;
		float sqrt_determinant = sqrt(determinant);
		float d1 = -scalarProjectionOfCenterToOrigOverRayDir - sqrt_determinant;
		float d2 = -scalarProjectionOfCenterToOrigOverRayDir + sqrt_determinant;
		
		if(d1 < 0.0 && d2 < 0.0) {
			return nullMaybeVec();
		} 
		else {
			vec3 closestIntersect = rayOrig + min(max(d1, 0.0), max(d2, 0.0)) * rayDir;
			return vec3MaybeVec(closestIntersect);
		}
	}
}

vec3 cameraRayOrig(vec2 screenPos) {
	return vec3(screenPos, -1.0);
}

vec3 lightDir() {
	return normalize(vec3(10.0*sin(time), 10, 0));
}

void main( void ) {

	vec2 screenPos = gl_FragCoord.xy / resolution.xy;
	
	MaybeVec3 intersect = sphereIntersect(cameraRayOrig(screenPos));
	if(intersect.isNull) {
		discard;
	}
	else {
		vec3 intersectNormal = intersect.value - sphereCenter;
		gl_FragColor = dot(lightDir(), intersectNormal)*vec4(1,1,1,0) + vec4(0,0,0,1);
		//gl_FragColor = vec4(intersect.value, 1.0);
	}
}