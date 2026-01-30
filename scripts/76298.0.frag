#extension GL_OES_standard_derivatives : enable

precision mediump float;

#define PI 3.14159265358979323846

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circles(vec2 uv) {
	vec2 size = vec2(0.5);
	vec2 positionInCell = (uv - (floor(uv / size) * size)) / size;
	return 1.0 - step(0.2, distance(positionInCell, vec2(0.5)));
}

vec2 mapRectangular(vec3 direction) {
    return vec2(
        fract((atan(direction.z, direction.x) + PI) / (2.0 * PI)),
        acos(direction.y) / PI
    );
}

vec2 stereographic(vec3 direction) {
	vec3 projectionPoint = vec3(0.0, 3.0, 1.0);
	float planeZ = -1.0;
	vec3 ray = normalize(direction - projectionPoint);
	vec3 intersection = projectionPoint + ray * ((planeZ - projectionPoint.y) / ray.y);
	return intersection.xz;
}


void main( void ) {
	vec2 uv = 2.0 * gl_FragCoord.xy / resolution - 1.0;
	vec3 ray = normalize(vec3(uv.xy + vec2(0.0, (sin(time) * 0.5 + 0.5) * 3.0), -0.6));
	
	
	float color = circles(mapRectangular(ray));
	color = circles(stereographic(ray));

	gl_FragColor = vec4(vec3(color), 9.0);
}