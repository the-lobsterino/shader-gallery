#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 sphericalNormal(float yaw, float pitch) {
	return vec3(cos(pitch) * cos(yaw), sin(pitch), sin(pitch) * cos(yaw));
}

mat3 sphericalMatrix(float yaw, float pitch) {
	return mat3(
		1.0, 0.0, 0.0,
		0.0, cos(pitch), -sin(pitch),
		0.0, sin(pitch), cos(pitch)
	)
	* mat3(
		cos(yaw), 0.0, -sin(yaw),
		0.0, cos(pitch), 0.0,
		sin(yaw), 0.0, cos(yaw)
	);
}

// Returns the location of the current fragment relative to the center of the screen, where 0.5 is the distance to the nearest screen border.
// This will return values > +-0.5 on the X axis in widescreen, and the Y axis in portrait.
vec2 pixelCoord() { 
	return ((gl_FragCoord.xy - (resolution / 2.0)) / min(resolution.x, resolution.y)); 
}

struct ray {
	vec3 start;
	vec3 normal;
};
	
ray lens() {
	return ray(vec3(0.0, 0.0, sin(time) * 4.0 -3.0), normalize(vec3(pixelCoord(), 0.5)) * sphericalMatrix(mouse.x, mouse.y * 2.0 - 2.0));
}

// Returns how long along a ray in world units the nearest point to a given point is.
// May return negative values.
float along(ray from, vec3 point) {
	return dot(point - from.start, from.normal);
}
		
vec3 nearest(ray from, vec3 point) {
	return from.start + from.normal * along(from, point);
}

float radial(vec3 origin, float rate) {
	return 1.0 / (1.0 + length(origin) * rate);
}

float directional(vec3 origin, vec3 normal, float focus) {
	return pow(max(0.0, dot(normalize(origin), normal)), focus);
}

float hideWhenBehind(float distance) {
	return distance > 0.0 ? distance : 1.0 / 0.0;
}

struct plane {
	vec3 normal;
	float distance;
};

float occlusionPlane(ray line, plane surface) {
    return dot(surface.normal, surface.normal * surface.distance - line.start) / dot(surface.normal, line.normal);	
}

struct sphere {
	vec3 origin;
	float radius;
};

float occlusion(ray from, sphere sphere) {
	float _along = along(from, sphere.origin);
	float distance = distance(from.start + from.normal * _along, sphere.origin) / sphere.radius;
	if(distance > 1.0) return 1.0 / 0.0;
	return _along - cos(asin(distance));
}

float occlusion(ray from) {
	return 
		hideWhenBehind(min(
			occlusion(from, sphere(vec3(1.0, 0.0, 1.0), 0.5)),
			occlusionPlane(from, plane(vec3(0.0, 1.0, 0.0), -0.3))
		));
}

vec3 closest(ray from, vec3 origin, float occlusionAlong, out float closeFade) {
	float dist = min(occlusionAlong, hideWhenBehind(along(from, origin)));
	closeFade = 1.0 - (1.0 / (1.0 + dist));
	return from.start + from.normal * dist - origin;
}


void main( void ) {
	ray from = lens();
	float occlusionAlong = occlusion(from);
	vec3 color = vec3(0.0);
	float dist;
	vec3 difference = closest(from, vec3(1.0, 2.0, 4.0), occlusionAlong, dist);
	color += vec3(0.4, 0.6, 1.0) * dist * radial(difference, 2.0) 
		* directional(difference, vec3(0.0, -1.0, 0.0), 4.0);	
	
	difference = closest(from, vec3(3.0, 1.0, 1.0), occlusionAlong, dist);
	color += vec3(1.0, 0.0, 0.0) * dist * radial(difference, 8.0) 
		* directional(difference, vec3(0.0, cos(time * 5.0), sin(time * 5.0)), 8.0);		
	
	difference = closest(from, vec3(-0.5, -0.125, -4.0), occlusionAlong, dist);
	color += vec3(0.5, 0.5, 0.0) * dist * radial(difference, 64.0);

	difference = closest(from, vec3(0.5, -0.125, -2.0), occlusionAlong, dist);
	color += vec3(0.5, 0.5, 0.0) * dist * radial(difference, 64.0);	
	
	difference = closest(from, vec3(-0.5, -0.125, 0.0), occlusionAlong, dist);
	color += vec3(0.5, 0.5, 0.0) * dist * radial(difference, 64.0);	
	
	gl_FragColor = vec4( pow(color, vec3(1.0 / 2.2)), 0.0 );

}