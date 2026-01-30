#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct IntersectResult {
	float a;
	float b;
	float c;
	float d;
};
	
float calculateIntersectionDistance(IntersectResult intersectRes) {
	if (intersectRes.d < 0.0) {
		return -1.0;
	}
	
	float resultA = (-intersectRes.b + sqrt(intersectRes.d)) / (intersectRes.a * 2.0);
	float resultB = (-intersectRes.b - sqrt(intersectRes.d)) / (intersectRes.a * 2.0);
	return resultA < resultB ? resultA : resultB;
}

vec3 getRayDirection(vec3 rayOrigin, vec2 pixelCoordinate, vec3 planeSegmentPosition, float planeSegmentSize) {
	float halfSize = planeSegmentSize / 2.0;
	float x = (pixelCoordinate.x * planeSegmentSize - halfSize) + planeSegmentPosition.x;
	float y = (pixelCoordinate.y * planeSegmentSize - halfSize) + planeSegmentPosition.y;
	float z = planeSegmentPosition.z;
	
	vec3 direction = normalize(vec3(x, y, z));
	return direction;
}

vec3 normalSphere(vec3 spherePosition, vec3 rayIntersection) {
	return normalize(rayIntersection - spherePosition);
}

IntersectResult intersectSphere(vec3 rayOrigin, vec3 rayDirection, vec3 spherePosition, float sphereRadius) {
	vec3 directionToShpere = rayOrigin - spherePosition;
	float a = dot(rayDirection, rayDirection);
	float b = 2.0 * dot(rayDirection, directionToShpere);
	float c = dot(directionToShpere, directionToShpere) - sphereRadius * sphereRadius;
	float d = b * b - 4.0 * a * c;
	
	IntersectResult result;
	result.a = a;
	result.b = b;
	result.c = c;
	result.d = d;	
	return result;
}

void main( void ) {
	vec2 pixelCoordinate = (gl_FragCoord.xy / resolution.y);
	vec3 rayOrigin = vec3(0, 0, 0);
	vec3 planeSegmentPosition = vec3(0, 0, 10);
	vec3 spherePosition = vec3(sin(time) * 4.0 + 4.0, 0, 15.0 + cos(time) * 4.0);
	vec3 rayDirection = getRayDirection(rayOrigin, pixelCoordinate, planeSegmentPosition, 8.0);
	vec3 lightPosition = vec3(4.0, 5.0, 15.0);
	vec3 lightColor = vec3(1, 1, 1);
	
	IntersectResult result = intersectSphere(rayOrigin, rayDirection, spherePosition, 1.0);
	if (result.d > 0.0) {
		float t = calculateIntersectionDistance(result);
		if (t < 0.0) {
			gl_FragColor = vec4(0, 0, 0, 1);
			return;
		}
		vec3 rayIntersection = rayOrigin + rayDirection * t;
		vec3 sphereNormal = normalize(normalSphere(spherePosition, rayIntersection));
		vec3 lightDirection = normalize(rayIntersection - lightPosition);
		vec3 viewDirection = normalize(rayIntersection - rayOrigin);
		
		vec3 sphereColor = vec3(1, 0, 0);
		vec3 ambient = sphereColor * 0.05;
		vec3 diffuse = max(dot(-lightDirection, sphereNormal), 0.0) * sphereColor * 0.55;
		
		vec3 reflectedLightDirection = reflect(-lightDirection, sphereNormal);
		vec3 specular = pow(max(dot(viewDirection, reflectedLightDirection), 0.0), 32.0) * lightColor * 0.9;
		
		gl_FragColor = vec4(ambient + diffuse + specular, 1);
	} else {
		gl_FragColor = vec4(0, 0, 0, 1);
	}
}