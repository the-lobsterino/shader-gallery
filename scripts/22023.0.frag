#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 sky() {
	return vec3( 0.1, 0.4, 0.9 );
}

vec3 cameraNormal() {
	return normalize(vec3(((gl_FragCoord.xy / resolution) - 0.5), 0.3));
}

float sphereDistance(vec3 origin, float radius, vec3 at) {
	return length(origin - at) - radius;
}

float planeDistance(float y, vec3 at) {
	return at.y - y;
}

float sceneDistance(vec3 at) {
	return min(min(sphereDistance(vec3(1.0, cos(time), 4.0), 1.4, at), sphereDistance(vec3(0.0, sin(time), 5.0), 1.2, at)), planeDistance(-1.0, at));
}

vec3 sceneNormal(vec3 at, float dist) {
	return normalize(vec3(
		sceneDistance(at + vec3(0.01, 0.0, 0.0)) - sceneDistance(at - vec3(0.01, 0.0, 0.0)), 
		sceneDistance(at + vec3(0.00, 0.01, 0.0)) - sceneDistance(at - vec3(0.00, 0.01, 0.0)), 
		sceneDistance(at + vec3(0.00, 0.00, 0.01)) - sceneDistance(at - vec3(0.00, 0.00, 0.01))));
}

vec3 sunNormal() {
	return normalize((vec3(10, 0, 10) * cos(time * 0.1)) + vec3(0, 10, 0));
}

vec3 directionalLight(vec3 normal) {
	return dot(normal, sunNormal()) * vec3(0.9, 0.7, 0.2);
}

bool raymarch(vec3 start, vec3 normal, out vec3 outnorm, out vec3 outloc, out float outdist) {
	bool retval = false;
	float along = 0.0;
	for(int iteration = 0; iteration < 128; iteration++) {
		float distance = sceneDistance(start + normal * along);
		if(distance < 0.01) {
			outloc = start + normal * along;
			outnorm = sceneNormal(outloc, distance);
			outdist = along;
			retval = true;
			break;
		}
		along += distance;
	}
	return retval;
}

void main( void ) {

	vec3 outnorm;
	vec3 outloc;
	float loltech;
	bool result = raymarch(vec3(0.0, 0.0, 0.0), cameraNormal(), outnorm, outloc, loltech);
	
	vec3 col;
	
	if(result) {
		outloc += sunNormal();
		vec3 whocares, lol;
		float distanceTo;
		if(raymarch(outloc, sunNormal(), whocares, lol, distanceTo) )
		col = directionalLight(outnorm) * min(1.0, distanceTo); else col = directionalLight(outnorm);
	} else col = sky();
	
	gl_FragColor = vec4( col, 1.0 );
}