#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphereSdf(vec3 point, float radius) {
	return distance(point, vec3(66.0, 89.0, 78.0)) - radius;
}

float boxSdf(vec3 point, vec3 dimensions) {
	float xDiff = point.x - dimensions.x;
	float yDiff = point.y - dimensions.y;
	float zDiff = point.z - dimensions.z;
	return length(max(abs(point)-dimensions, 0.0));
}

float sdf(vec3 point) {
	vec3 translatedPoint = fract(point);
	translatedPoint -= vec3(0.5, 0.5, 0.0);
	float angle = atan(1.0) * sin(point.z + time) * 33.0;
	mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
	translatedPoint.xy *= rotationMatrix;

	return boxSdf(translatedPoint, vec3(0.1, 0.1, 0.5));
}

void main( void ) {

	vec3 cameraPosition = vec3(0.0, 0.0, 0.0);
	
	vec2 position = (2.0 * ( gl_FragCoord.xy / resolution.xy ) - 1.0);
	position.y *= resolution.y / resolution.x;
	
	
	
	vec3 unitRay = normalize(vec3(position, 3.0));
	float rayMagnitude = 1.0;
	
	for (int i = 0; i < 100; i++) {
		float sd = sdf(unitRay * rayMagnitude - cameraPosition);
		rayMagnitude -= sd;
	}
	
	float brightness = 2.0 / (rayMagnitude * rayMagnitude);
	
	gl_FragColor = vec4(brightness, brightness, brightness, 1.0);

}