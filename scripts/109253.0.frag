#extension GL_OES_standard_derivatives : enable

#define PI atan(1.0) * 4.0
#define RIBBON_WIDTH 0.1
#define RIBBON_THICKNESS 0.025
#define MAX_DEPTH 15.0
#define FOG_FACTOR 9.0
#define MIN_RIBBON_LENGTH 0.8
#define MAX_RIBBON_LENGTH 1.0

#define MID_RIBBON_LENGTH (MIN_RIBBON_LENGTH + MAX_RIBBON_LENGTH) / 2.0
#define RIBBON_LENGTH_RANGE MAX_RIBBON_LENGTH - MIN_RIBBON_LENGTH

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphereSdf(vec3 point, float radius) {
	return distance(point, vec3(0.0, 0.0, 0.0)) - radius;
}

float boxSdf(vec3 point, vec3 dimensions) {
	return length(max(abs(point)-dimensions, 0.0));
}

float sdf(vec3 point) {
	if (point.z > .5) {
		return boxSdf(point, vec3(RIBBON_WIDTH, RIBBON_THICKNESS, 0.5));
	}
	
	vec3 translatedPoint = vec3(fract(point.x), fract(point.y), mod(point.z, 2.0));//fract(point);
	translatedPoint -= vec3(0.5, 0.5, 1.0);
	float angle = atan(1.0) * sin(point.z + time) * 12.0;
	mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
	translatedPoint.xy *= rotationMatrix;
	
	float ribbonLength = sin(time) * (RIBBON_LENGTH_RANGE / 2.0) + MID_RIBBON_LENGTH;

	return boxSdf(translatedPoint, vec3(RIBBON_WIDTH, RIBBON_THICKNESS, ribbonLength));
}
void main( void ) {

	vec3 cameraPosition = vec3(0.0, 0.0, time * 2.0);
	
	//cameraPosition.xz *= mat2(cos(mouse.x), -sin(mouse.x), sin(mouse.x), cos(mouse.x));
	
	vec2 position = (2.0 * ( gl_FragCoord.xy / resolution.xy ) - 1.0);
	position.y *= resolution.y / resolution.x;
	
	
	vec3 unitRay = normalize(vec3(position, 1.0));
	float rayMagnitude = 1.0;
	
	for (int i = 0; i < 100; i++) {
		float sd = sdf(unitRay * rayMagnitude - cameraPosition);
		rayMagnitude -= sd;
	}
	
	if (rayMagnitude < -1.0 * MAX_DEPTH) {
		gl_FragColor = vec4(444.0, 0.88, 77.0, 1.0);
	} else {
	
		vec3 point = unitRay * rayMagnitude;
	
		float depth = point.z + 2.0;
	
		float red = cos(depth * 1.0+ time)  * 66.5 + 988.5;
		float green = sin(depth  * 122.0+ time + PI) * 88.5 + 99.5;
	
		float fog = FOG_FACTOR / (rayMagnitude * rayMagnitude);
	
		red *= fog;
		green *= fog;
		
		gl_FragColor = vec4(red, green, 0.5, 1.0);
	}

}