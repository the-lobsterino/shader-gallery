precision highp float;

struct Ray {
	vec3 origin;
	vec3 direction;
};

struct Hit {
	bool collision;
	vec3 point;
	vec3 normal;
	vec3 color;
	float shininess;
};

struct Camera {
	vec3 eye;
	vec3 target;
	vec3 up;
	float fov;
	float aspect;
};

struct Lighting {
	vec3 lightDirection;
	vec3 lightIntensity;
	vec3 lightAmbient;
};

Ray launchPrimary(in vec2 uv, in Camera camera) {

	Ray ray;

	ray.origin = camera.eye;

	vec2 ndc = vec2(2.0 * (uv.x - 0.5) * camera.aspect, 2.0 * (uv.y - 0.5));

	vec2 rdXY = ndc;
	float rdZ = 1.0 / (tan(camera.fov) / 2.0);
	ray.direction = normalize(vec3(rdXY, rdZ));

	vec3 f = normalize(camera.eye - camera.target);
	vec3 s = normalize(cross(f, camera.up));
	vec3 u = cross(s, f);
	mat3 m_View = mat3(s, u, -f);

	ray.direction = m_View * ray.direction;

	return ray;

}

uniform float time;

float distanceCylinder(in vec3 p, in vec2 c) {
	vec2 d = abs(vec2(length(p.xz), p.y)) - c;
	return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float distanceLine(in vec3 p, in vec3 a, in vec3 b, in float r) {
	vec3 pa = p - a;
	vec3 ba = b - a;
	float h = clamp( dot(pa, ba) / dot(ba, ba), 0.0, 1.0 );
	return length(pa - ba * h) - r;
}

float distanceSphere(in vec3 p, in float r) {
	return length(p) - r;
}

vec3 displaceNoise(in vec3 p) {
	return vec3 (
		p.x + 0.45 * sin(p.x * 2.5 + 0.3 * time) * sin (p.y * 3.8 - 0.8 * time) * cos(p.z * 2.4 + time),
		p.y + 0.45 * cos(-p.x * 2.0 - 0.5 * time) * cos(p.y * 1.4 + time) * -sin(p.z * 1.8 - 2.7 * time),
		p.z + 0.45 * cos(p.z * 1.5 + 0.7 * time) * cos (p.y * 4.0 - 0.1 * time) * sin(p.z * 1.5 + time * 0.85)
	);
}

float sceneDistance(in vec3 p) {
	vec3 pp = displaceNoise(p);
	
	float d = distanceSphere(pp - vec3( cos(1.5 * time) * sin(1.5 * time), sin(1.5 * time) * -cos(1.5 * time), -sin(1.5 * time) * cos(1.5 * time) ), 1.0);
	
	for(int i = 1; i < 8; i++) {
		d = min(d, distanceSphere(pp - vec3( float(i) * cos(2.5 * time + float(i) * 0.3) * sin(1.5 * time + float(i) * 0.3),  float(i) * sin(1.5 * time + float(i) * 0.3) * -cos(2.5 * time + float(i) * 0.3),  float(i) * -sin(2.5 * time + float(i) * 0.3) * cos(1.5 * time + float(i) * 0.3) ), float(i) * 0.5));
	}
	
	return d;
}

vec3 sceneNormal(in vec3 p) {
	#define EPSILON 0.01
	return normalize(
		vec3(
			sceneDistance(vec3(p.x + EPSILON, p.y, p.z)) - sceneDistance(vec3(p.x - EPSILON, p.y, p.z)),
			sceneDistance(vec3(p.x, p.y + EPSILON, p.z)) - sceneDistance(vec3(p.x, p.y - EPSILON, p.z)),
			sceneDistance(vec3(p.x, p.y, p.z  + EPSILON)) - sceneDistance(vec3(p.x, p.y, p.z - EPSILON))
		)
	);
}

vec3 sceneColor(in vec3 p) {
	return vec3(1.0);
}

float sceneShininess(in vec3 p) {
	return 128.0;
}

Hit hitScene(in Ray ray) {

	Hit result;
	result.collision = false;
	float totalDistance = 0.0;

	for(int i = 0; i < 196; i++) {
		vec3 p = ray.origin + totalDistance * ray.direction;
		float dScene = sceneDistance(p);

		if (dScene <= 0.005) {
			result.collision = true;
			result.point = p;
			result.normal = sceneNormal(p);
			result.color = sceneColor(p);
			result.shininess = sceneShininess(p);
			return result;
		}

		totalDistance += min(dScene, 0.1);
	}

	return result;

}

vec3 illuminate(in Hit hit, in Camera camera, in Lighting lighting) {
    return hit.normal * 0.5 + 0.5;
}

uniform vec2 resolution;

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec3 color = vec3(0.0);

	Camera camera;
	camera.eye = vec3(16.0 * cos(time * 0.35), 10.0 * sin(time * 0.45), 16.0 * sin(time * 0.35));
	camera.target = vec3(0.0, 0.0, 1.0);
	camera.up = vec3(0.0, 1.0, 0.0);
	camera.fov = radians(60.0);
	camera.aspect = resolution.x / resolution.y;

	Lighting lighting;
	lighting.lightDirection = normalize(vec3(-1.0, -1.6, 0.9));
	lighting.lightAmbient = vec3(0.05, 0.06, 0.08);
	lighting.lightIntensity = vec3(1.1, 2.0, 1.9);

	Ray ray = launchPrimary(uv, camera);
	Hit primaryHit = hitScene(ray);

	if (primaryHit.collision) {
		color = illuminate(primaryHit, camera, lighting);
	}

	gl_FragColor = vec4( color, 1.0 );

}