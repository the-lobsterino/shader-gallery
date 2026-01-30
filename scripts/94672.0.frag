//#version 300 es


// (c) 2022 Alexander Chekmenev

// References:
// https://glslsandbox.com/e#975.0
// https://glslsandbox.com/e#75360.1


#define MOUSELOOK

#define AMBIENT
#define DIFFUSE
#define SPECULAR
#define SHADOWS

#define REFLECTION
#define REFRACTION

#define BILATERAL_PLANES
//#define INSIDE

const int maxRaysCount = 32 - 1; // 2^{max recursion layer} - 1


#ifdef GL_ES
precision mediump float;
#endif

// uniforms
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float bounceGap = 0.0001; // Distance that the intersection point is shifted in the direction of the surface normal
//const float minReflectRatio = 0.01;
const float minAttenuation2 = 0.01;

const float PI = 3.14159265358979323846;
//const float INFINITY = 16000.0; // https://stackoverflow.com/a/6336285
const float INFINITY = 1.0/0.0;

////////////////////////////////////////////////////////////////
// Geometric objects

struct Ray {
	vec3 start;
	vec3 direction;
};

struct Sphere {
	vec3 center;
	float radius;
};

struct Plane {
	vec3 point;
	vec3 normal;
};

struct Rectangle {
	Plane plane;
	vec3 up;
	vec2 halfSize;
};
	
struct RectangleTiled {
	Plane plane;
	vec3 up;
	vec2 tileSize;
	vec2 tileRatio;
	ivec2 halfTilesNum;
};

// x^2 / a^2 + y^2 / b^2 + z^2 / c^2 = 1
struct Ellipsoid {
	vec3 center;
	mat3 basis; // Orthonormal basis associated with the object
	vec3 semiaxis; // (a, b, c)
};
	
// x^2 / a^2 + y^2 / b^2 - z^2 / c^2 = 1
struct Hyperboloid {
	vec3 center;
	mat3 basis; // Orthonormal basis associated with the object
	vec3 semiaxis; // (a, b, c)
	float minZ, maxZ;
};

//
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// Geometric routines
	
// Any intersect function returns outer normal at the point of intersection
	
#define sqr(x) ((x)*(x))
#define len2(v) (dot((v),(v)))
	
// Matrix of rotation around unit vector k by angle (Rodrigues' rotation formula)
mat3 rotation(vec3 k, float angle) {
	// Cross product matrix: KV = [k, v]
	mat3 K = mat3(
		 0.0,  k.z, -k.y,
		-k.z,  0.0,  k.x,
		 k.y, -k.x,  0.0
	);
	return mat3(1.0) + (mat3(sin(angle)) + (1.0 - cos(angle)) * K) * K;
}

// Returns true if equation a t^2 + 2k t + c = 0 has roots t1, t2. If roots exists and a > 0, t1 <= t2
bool rootsQuadratic(float a, float k, float c, out float t1, out float t2) {
	float D_4 = k*k - a*c;
	if (D_4 < 0.0)
		return false;
	float s = sqrt(D_4);
	t1 = (-k - s) / a;
	t2 = (-k + s) / a;
	return true;
}

Ray rayToObjectCooridnates(const Ray ray, const vec3 objectOrigin, mat3 objectBasis) {
	return Ray((ray.start - objectOrigin) * objectBasis, ray.direction * objectBasis);
}

Ray normalToWorldCooridnates(const Ray normal, const vec3 objectOrigin, const mat3 objectBasis) {
	return Ray(objectBasis * normal.start + objectOrigin, objectBasis * normal.direction);
}

float intersectCanonical(const Ellipsoid el, const Ray ray, out Ray normal) {
	vec3 semiaxis2 = sqr(el.semiaxis);
	// Coefficients of the equation a t^2 + 2k t + c = 0
	vec3 tmp = ray.direction / el.semiaxis;
	float a = len2(tmp);
	float k = dot(ray.direction * ray.start / semiaxis2, vec3(1.0));
	tmp = ray.start / el.semiaxis;
	float c = len2(tmp) - 1.0;
	float t1, t2;
	if (!rootsQuadratic(a, k, c, t1, t2))
		return INFINITY;

	float t = INFINITY;
	// We know that t1 <= t2
	if (t1 >= 0.0)
		t = t1;
	else if (t2 >= 0.0)
		t = t2;
	if (t != INFINITY) {
		vec3 intersection = ray.start + t * ray.direction;
		normal = Ray(intersection, normalize(intersection / semiaxis2));
		#ifdef INSIDE
		// Invert normal if we're inside the ellipsoid
		if (t1 * t2 < 0.0)
			normal.direction *= -1.0;
		#endif
	}

	return t;
}
float intersect(const Ellipsoid el, Ray ray, out Ray normal) {
	float distToIntersection = intersectCanonical(el, rayToObjectCooridnates(ray, el.center, el.basis), normal);
	normal = normalToWorldCooridnates(normal, el.center, el.basis);
	return distToIntersection;
}

// Returns distance to the first intersection
float intersect(const Sphere sphere, const Ray ray, out Ray normal) {
	return intersect(Ellipsoid(sphere.center, mat3(1.0), vec3(sphere.radius)), Ray(ray.start, ray.direction), normal);
	//if (dot(sphere.center, sphere.center) < 0.1)
	//	++num;
	
	/*vec3 d = ray.start - sphere.center;
	float a = dot(ray.direction, ray.direction);
	//a = 1.0;
	//if (abs(a - 1.0) > 0.0001)
	//	flag = true;
	float k = dot(ray.direction, d);
	float c = dot(d, d) - sqr(sphere.radius);

	// Compute with 'a' is more numerically stable than taking a = 1. There was subtle glitched because of that
	float D_4 = k*k - a*c;
	if (D_4 < 0.0)
		return INFINITY;

	float sqrt_D_4 = sqrt(D_4);
	float t1 = (-k - sqrt_D_4) / a;
	float t2 = (-k + sqrt_D_4) / a;
	
	//sort(t1, t2);
	
	//if (t2 < 0.0 && num == 1)
	//	flag = true;
	

	float t = INFINITY;
	if (t1 >= 0.0)
		t = t1;
	else if (t2 >= 0.0) {
		t = t2;
		//flag = true;
	}
	if (t != INFINITY) {
		vec3 intersection = ray.start + t * ray.direction;
		normal = Ray(intersection, (intersection - sphere.center) / sphere.radius);
		#ifdef INSIDE
		// Invert normal if we're inside the sphere
		if (t1 * t2 < 0.0)
			normal.direction *= -1.0;
		#endif
	}
	
	//if (num == 1 && t == INFINITY)
	//	flag = true;
	
	//if (sqrt(dot(d, d)) < sphere.radius)
	//if (num == 2 && dot(ray.start, ray.start) < sqr(sphere.radius) - 0.0001)
	//	flag = true;

	return t;*/
}





// Square of a vector length for a dot product with signature (+1, +1, -1)
float len2PPM(vec3 v) {
	return dot(v.xy, v.xy) - sqr(v.z);
}
float intersectEdge(const Hyperboloid hyp, const Ray ray, const float z) {
	float t = (z - ray.start.z) / ray.direction.z;
	vec3 intersection = vec3(ray.start.xy + t * ray.direction.xy, z);
	// Whether we're ineide the ellipsoid
	if (t < 0.0 || len2PPM(intersection / hyp.semiaxis) > 1.0)
		t = INFINITY;
	return t;
}
float intersectEdges(const Hyperboloid hyp, const Ray ray, out Ray normal) {
	float tUpper = intersectEdge(hyp, ray, hyp.maxZ);
	float tBottom = intersectEdge(hyp, ray, hyp.minZ);
	float tClosest = min(tUpper, tBottom);
	vec3 intersection = ray.start + tClosest * ray.direction;
	normal = Ray(intersection, vec3(0.0, 0.0, tUpper <= tBottom ? 1.0 : -1.0));
	return tClosest;
}
void filterBehindAndOutOfHeightT(inout float t, const Ray ray, const float minZ, const float maxZ) {
	float intersectionZ = ray.start.z + t * ray.direction.z;
	if (t < 0.0 || intersectionZ < minZ || intersectionZ > maxZ)
		t = INFINITY;
}
float intersectCanonical(const Hyperboloid hyp, const Ray ray, out Ray normal) {
	vec3 semiaxis2 = sqr(hyp.semiaxis);
	// Coefficients of a quadratic equation
	float a = len2PPM(ray.direction / hyp.semiaxis);
	float k = dot(ray.direction * ray.start / semiaxis2, vec3(1.0, 1.0, -1.0));
	float c = len2PPM(ray.start / hyp.semiaxis) - 1.0;
	// Intersections with curved part of the hyperboloid
	float tCurved = INFINITY;
	float t1, t2;
	bool intersect = rootsQuadratic(a, k, c, t1, t2);
	if (intersect) {
		filterBehindAndOutOfHeightT(t1, ray, hyp.minZ, hyp.maxZ);
		filterBehindAndOutOfHeightT(t2, ray, hyp.minZ, hyp.maxZ);
		tCurved = min(t1, t2);
	}
	// Intersections with horisontal planes
	float t = intersectEdges(hyp, ray, normal);
	// Pick the closest one
	if (tCurved < t) {
		t = tCurved;
		vec3 intersection = ray.start + t * ray.direction;
		vec3 outerNormal = intersection / semiaxis2;
		outerNormal.z *= -1.0;
		normal = Ray(intersection, normalize(outerNormal));
	}
	
	#ifdef INSIDE
	if (t != INFINITY)
		// Invert normal if we're inside
		if (len2PPM(ray.start / hyp.semiaxis) < 1.0 && hyp.minZ < ray.start.z && ray.start.z < hyp.maxZ)
			normal.direction *= -1.0;
	#endif

	return t;
}
float intersect(const Hyperboloid hyp, const Ray ray, out Ray normal) {
	float distToIntersection = intersectCanonical(hyp, rayToObjectCooridnates(ray, hyp.center, hyp.basis), normal);	
	normal = normalToWorldCooridnates(normal, hyp.center, hyp.basis);
	return distToIntersection;
}

float intersect(const Plane plane, const Ray ray, out Ray normal) {
	float t = dot(plane.point - ray.start, plane.normal) / dot(ray.direction, plane.normal);
	if (t < 0.0)
		return INFINITY;

	vec3 intersection = ray.start + t * ray.direction;
	normal = Ray(intersection, plane.normal);
	if (dot(ray.direction, plane.normal) > 0.0)
		#ifdef BILATERAL_PLANES
		normal.direction *= -1.0;
		#else
		t = INFINITY;
		#endif
	
	return t;	
}

float intersect(const Rectangle rectangle, const Ray ray, out Ray normal) {
	float t = intersect(rectangle.plane, ray, normal);
	vec3 dp = normal.start - rectangle.plane.point;
	vec2 p = vec2(
		dot(dp, cross(rectangle.up, rectangle.plane.normal)),
		dot(dp, rectangle.up)
	);
	if (any(greaterThanEqual(abs(p), rectangle.halfSize)))
		t = INFINITY;
	return t;
}

float intersect(const RectangleTiled rectangle, const Ray ray, out Ray normal) {
	float t = intersect(rectangle.plane, ray, normal);
	vec3 dp = normal.start - rectangle.plane.point;
	vec2 p = vec2(
		dot(dp, cross(rectangle.up, rectangle.plane.normal)),
		dot(dp, rectangle.up)
	);
	//const float eps = 0.000001; // To avoid artifacts for coordinates near tile size
	//vec2 pFactoredNormalized = fract(mod(p - vec2(eps, eps), rectangle.tileSize) / rectangle.tileSize);
	vec2 pFactoredNormalized = fract(mod(p, rectangle.tileSize) / rectangle.tileSize);
	vec2 halfSize = rectangle.tileSize * vec2(rectangle.halfTilesNum);
	if (any(greaterThanEqual(abs(p), halfSize)) || any(greaterThanEqual(pFactoredNormalized, rectangle.tileRatio)))
		t = INFINITY;
	return t;
}

//
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// Types of objects on the scene

// https://en.wikipedia.org/wiki/Phong_reflection_model#Description
struct PointLight {
	//vec3 position;
	Sphere sphere; // position for everything and radius for rendering
	vec3 diffuseColor; // "Length" of a vector is light intencity. See anbientLightColor initialization
	//float diffusePower;
	vec3 specularColor; //
	//float specularPower;
};


struct Material {
	vec3 ambientColor;
	vec3 diffuseColor;
	vec3 specularColor;
	float shininess;
	float reflectRatio; // the ratio of intencity of reflected light to intencity of incoming light
	vec3 refractionCoefficient; // the ratio of intencity of reflected light to intencity of incoming light for each color component
	float refractiveIndex;
};


struct Ball {
	Sphere sphere;
	Material material;
};

struct Board {
	Rectangle rectangle;
	Material material;
};
	
struct BoardTiled {
	RectangleTiled rectangleTiled;
	Material material;
};
	
struct Ovoid {
	Ellipsoid ellipsoid;
	Material material;
};
	
struct Hyper {
	Hyperboloid hyperboloid;
	Material material;
};
	
//
////////////////////////////////////////////////////////////////
	
////////////////////////////////////////////////////////////////
// Scene
	
const int ballsCount = 2;
Ball balls[ballsCount];

const int boardsCount = 2;
Board boards[boardsCount];

const int boardsTiledCount = 1;
BoardTiled boardsTiled[boardsTiledCount];

const int ovoidsCount = 3;
Ovoid ovoids[ovoidsCount];

const int hypersCount = 1;
Hyper hypers[hypersCount];

const int lightsCount = 2;
PointLight lights[lightsCount];

vec3 ambientLightColor;

vec3 getAmbientLight() {
	vec3 color = vec3(0.0);
	for (int i = 0; i < lightsCount; ++i) {
		color += lights[i].diffuseColor;
		color += lights[i].specularColor;
	}
	color /= float(2 * lightsCount);
	// Normalize (in some sence) color
	float maxColorComponent = max(max(color.r, color.g), color.b);
	if (maxColorComponent > 0.0)
		color /= maxColorComponent;
	// Ambient light intencity
	color *= 0.01;
	
	return color;
}
void initLights() {
	// Point lights
	lights[0].sphere = Sphere(vec3(2.0, 0.0, 1.0), 0.075);
	lights[0].diffuseColor = vec3(1.0) * 2.0;
	lights[0].specularColor = vec3(1.0) * 2.0;
	
	lights[1].sphere = Sphere(vec3(0.0, 1.0, 1.0), 0.1);
	lights[1].diffuseColor = vec3(1.0, 0.5, 1.0) * 0.75;
	lights[1].specularColor = vec3(1.0, 0.5, 1.0) * 0.75;

	// Ambient light
	ambientLightColor = getAmbientLight();
}

void initObjects() {
	float angle; // auxiliary variable
	// Boards
	angle = PI / 4.0;
	boards[0].rectangle = Rectangle(
		Plane(vec3(0.0, 0.0, 5.0), vec3(0.0, 0.0, -1.0)),
		vec3(-sin(angle), -cos(angle), 0.0),
		vec2(4.5, 2.3)
	);
	boards[0].material = Material(vec3(1.0) * 1.0, vec3(1.0) * 1.0, vec3(1.0), 100.0, 0.99, vec3(0.0), 1.0);
	
	boards[1].rectangle = Rectangle(
		Plane(vec3(0.0, 5.0, 0.0), vec3(0.0, -1.0, 0.0)),
		vec3(0.0, 0.0, -1.0),
		vec2(4.5, 2.3)
	);
	boards[1].material = Material(vec3(1.0) * 1.0, vec3(1.0) * 1.0, vec3(1.0), 100.0, 0.99, vec3(0.0), 1.0);
	
	// Tiled boards
	boardsTiled[0].rectangleTiled = RectangleTiled(
		Plane(vec3(0.0, 0.0, -1.0), vec3(0.0, 0.0, 1.0)),
		vec3(0.0, 1.0, 0.0),
		vec2(0.5, 0.5),
		vec2(0.9, 0.9),
		ivec2 (9, 5)
	);
	boardsTiled[0].material = Material(vec3(1.0) * 1.0, vec3(1.0) * 1.0, vec3(1.0), 100.0, 0.99, vec3(0.0), 1.0);

	// Balls
	float R = 0.75;
	float Rx = 0.75;
	float Ry = 0.01;
	angle = time;
	balls[0].sphere = Sphere(vec3(Rx * cos(angle), Ry * sin(angle) + 0.25, 0.0), 0.5);
	balls[0].material = Material(vec3(0.0, 0.0, 1.0), vec3(1.0, 1.0, 0.0), vec3(1.0, 1.0, 1.0), 50.0, 0.5, vec3(0.5, 0.5, 0.0), 1.333);
	R = 0.75;
	angle = time * 2.0 + PI/4.0;
	balls[1].sphere = Sphere(balls[0].sphere.center + rotation(vec3(0.0, 1.0, 0.0), -PI/4.0) * vec3(R * cos(angle), R * sin(angle), 0.0), 0.2);
	balls[1].material = Material(vec3(0.0, 1.0, 1.0), vec3(0.0, 1.0, 1.0), vec3(1.0), 25.0, 0.7, vec3(0.0), 1.0);
	
	// Ovoids
	angle = -time;
	ovoids[0].ellipsoid = Ellipsoid(
		vec3(1.2, 1.7, 0.0),
		rotation(vec3(0.0, -1.0, 0.0), angle), 
		vec3(1.0, 0.5, 0.5)
	);
	ovoids[0].material = Material(vec3(1.0), vec3(1.0), vec3(1.0), 100.0, 0.99, vec3(0.0), 1.0);
	
	angle = PI/3.0;
	ovoids[1].ellipsoid = Ellipsoid(
		vec3(0.0, -1.0, 0.0),
		rotation(vec3(1.0, 0.0, 0.0), angle), 
		vec3(1.0, 1.0, 0.2)
	);
	ovoids[1].material = Material(vec3(0.0, 1.0, 1.0), vec3(0.0, 1.0, 1.0), vec3(1.0), 100.0, 0.1, vec3(0.25, 0.95, 0.95), 1.3333);
	
	ovoids[2].ellipsoid = Ellipsoid(
		vec3(-2.5, 0.5, 0.0),
		mat3(1.0),
		vec3(0.95, 0.95, 1.0)
	);
	ovoids[2].material = Material(vec3(0.0, 1.0, 0.0), vec3(0.0, 1.0, 0.0), vec3(1.0), 100.0, 0.5, vec3(0.25, 0.95, 0.25), 1.3333);
	
	// Hyperboloids
	angle = -PI/4.0;
	hypers[0].hyperboloid = Hyperboloid(
		vec3(1.75, -1.25, 0.0),
		rotation(normalize(vec3(1.0, -1.0, 0.0)), angle),
		vec3(0.45, 0.45, 0.6),
		-0.61, 0.7
	);
	hypers[0].material = Material(vec3(1.0), vec3(1.0), vec3(1.0), 20.0, 0.5, vec3(0.5), 1.333);
}

void initScene() {
	initLights();
	initObjects();
}

//
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// Pixel color computation

// Computes Phong ambient illumination component
vec3 ambientColorTerm(Material material, vec3 ambientLightColor) {
	return material.ambientColor * ambientLightColor;
}
// Computes Phong diffuse illumination component given the normal at intersection point, direction to light and light color
vec3 diffuseColorTerm(Material material, vec3 normal, vec3 lightDirection, vec3 lightColor) {
	float dp = dot(lightDirection, normal);
	// Whether I need to check positivity of dp? Maybe no: if dp < 0 there'd be an intersection
	return material.diffuseColor * dp * lightColor;
	//return dp > 0.0 ? dp * material.diffuseColor * lightColor : vec3(0.0);
}
// Computes Phong specular illumination component given the normal and the touch point (in ray),
//  the eye position, the direction to light and light color
vec3 specularColorTerm(Material material, Ray normal, vec3 lightDirection, vec3 lightColor, vec3 eye) {
	vec3 reflectedDir = reflect(lightDirection, normal.direction);
	vec3 viewDir = normalize(eye - normal.start);
	float dp = -dot(reflectedDir, viewDir);
	return dp > 0.0 ? material.specularColor * pow(dp, material.shininess) * lightColor : vec3(0.0);
}
// normal -- normal to surface at the point normal.start
// https://en.wikipedia.org/wiki/Phong_reflection_model#Description
vec3 illuminationPhong(vec3 ambientLightColor, PointLight light, Material material, Ray normal, vec3 eye) {
	vec3 viewDir = normalize(eye - normal.start);

	vec3 toLight = light.sphere.center - normal.start;
	float distToLight2 = dot(toLight, toLight);
	vec3 lightDir = toLight / sqrt(distToLight2);

	vec3 color = vec3(0.0);
	#ifdef DIFFUSE
	color += diffuseColorTerm(material, normal.direction, lightDir, light.diffuseColor);
	#endif
	#ifdef SPECULAR
	color += specularColorTerm(material, normal, lightDir, light.specularColor, eye);
	#endif
	color /= distToLight2; // Another reasonable alternative -- to divide after addition of an ambient term
	#ifdef AMBIENT
	color += ambientColorTerm(material, ambientLightColor);
	#endif

	return color;
}

// Point of reflection
struct Bounce {
	Ray normal;
	Material material;
};

// Returns distance to the closest object in a given direction
float intersectScene(const Ray ray, out Bounce bounce) {
	float distMin = INFINITY;
	float dist;
	Ray normal;
	// Balls
	for (int i = 0; i < ballsCount; ++i) {
		dist = intersect(balls[i].sphere, ray, normal);
		if (dist < distMin) {
			distMin = dist;
			bounce = Bounce(normal, balls[i].material);
		}
	}
	// Boards
	for (int i = 0; i < boardsCount; ++i) {
		dist = intersect(boards[i].rectangle, ray, normal);
		if (dist < distMin) {
			distMin = dist;
			bounce = Bounce(normal, boards[i].material);
		}
	}
	// Tiled boards
	for (int i = 0; i < boardsTiledCount; ++i) {
		dist = intersect(boardsTiled[i].rectangleTiled, ray, normal);
		if (dist < distMin) {
			distMin = dist;
			bounce = Bounce(normal, boardsTiled[i].material);
		}
	}
	// Ovoids
	for (int i = 0; i < ovoidsCount; ++i) {
		dist = intersect(ovoids[i].ellipsoid, ray, normal);
		if (dist < distMin) {
			distMin = dist;
			bounce = Bounce(normal, ovoids[i].material);
		}
	}
	// Hyperboloids
	for (int i = 0; i < hypersCount; ++i) {
		dist = intersect(hypers[i].hyperboloid, ray, normal);
		if (dist < distMin) {
			distMin = dist;
			bounce = Bounce(normal, hypers[i].material);
		}
	}

	return distMin;
}

// Returns distance to the closest point light sphere in a given direction
float intersectLights(Ray ray, out vec3 closestLightColor) {
	float distMin = INFINITY;
	//ray.direction = normalize(ray.direction);
	// Light spheres
	for (int i = 0; i < lightsCount; ++i) {
		Ray normal;
		float dist = intersect(lights[i].sphere, ray, normal);
		if (dist < distMin) {
			distMin = dist;
			closestLightColor = (lights[i].diffuseColor + lights[i].specularColor) / 2.0;
		}
	}
	
	return distMin;
}

struct RayInfo {
	Ray ray;
	vec3 attenuation;
};
	
RayInfo rayInfos[maxRaysCount];

// Returns true if ray intersected some objects and was reflected
bool lightScene(const RayInfo rayInfo, inout vec3 color, const bool rightOutFromEye, out RayInfo reflectedRayInfo, out RayInfo refractedRayInfo) {
	Ray ray = rayInfo.ray;
	vec3 attenuation = rayInfo.attenuation;
	if (len2(attenuation) < minAttenuation2)
		return false;
	
	Bounce bounce;
	float distToClosestObject = intersectScene(ray, bounce);
	// If we see the light directly, we see nothing but it
	if (rightOutFromEye) {
		vec3 closestLightColor;
		float distToClosestLight = intersectLights(ray, closestLightColor);
		if (distToClosestLight < distToClosestObject) {
			color = closestLightColor;
			return false;
		}
	}
	if (distToClosestObject == INFINITY)
		return false;

	// Whether we see the surface from the outside
	bool externalTouch = dot(ray.direction, bounce.normal.direction) <= 0.0;
	
	float reflectionCoefficient;
	vec3 refractionCoefficient;
	if (externalTouch) {
		reflectionCoefficient = bounce.material.reflectRatio;
		refractionCoefficient = bounce.material.refractionCoefficient;
	}
	else {
		reflectionCoefficient = 0.0;
		refractionCoefficient = vec3(1.0);
		//reflectionCoefficient = dot(bounce.material.refractionCoefficient, vec3(1.0));
		//refractionCoefficient =  vec3(bounce.material.reflectRatio);
		
		bounce.normal.direction *= -1.0;
	}
	#ifndef REFLECTION
	reflectionCoefficient = 0.0;
	#endif
	#ifndef REFRACTION
	refractionCoefficient = vec3(0.0);
	#endif
	vec3 shiftOutward = bounce.normal.direction * bounceGap;
	// Positions on the same and on the other side of the surface as the ray start, respectively
	vec3 bouncePosReflected = bounce.normal.start + shiftOutward;
	vec3 bouncePosTransmitted = bounce.normal.start - shiftOutward;
	
	reflectedRayInfo = RayInfo(
		Ray(bouncePosReflected, reflect(ray.direction, bounce.normal.direction)),
		attenuation * reflectionCoefficient
	);

	vec3 refractDir = refract(ray.direction, bounce.normal.direction, bounce.material.refractiveIndex);
	bool totalInternalReflection = len2(refractDir) < bounceGap;
	if (!totalInternalReflection)
		refractDir = normalize(refractDir);
	else
		refractionCoefficient = vec3(0.0);
	refractedRayInfo = RayInfo(
		Ray(bouncePosTransmitted, refractDir),
		attenuation * refractionCoefficient
	);
	
	if (externalTouch) {
		vec3 dColor = vec3(0.0);
		for (int i = 0; i < lightsCount; ++i) {
			#ifdef SHADOWS
			Ray rayToLight = Ray(bouncePosReflected, normalize(lights[i].sphere.center - bouncePosReflected));
			float distToLight = distance(bouncePosReflected, lights[i].sphere.center);
			Bounce bounceShadow;
			if (intersectScene(rayToLight, bounceShadow) > distToLight)
			#endif
				dColor += illuminationPhong(ambientLightColor, lights[i], bounce.material, bounce.normal, ray.start);
		}
		color += dColor * (attenuation * bounce.material.reflectRatio);
	}
	
	return true;	
}

vec3 getPixelColor(Ray ray) {
	vec3 color = vec3(0.0);
	
	rayInfos[0] = RayInfo(ray, vec3(1.0)); // initial ray
	
	for (int i = 0; i < maxRaysCount; ++i) {
		if (len2(rayInfos[i].attenuation) < minAttenuation2)
			continue;
		RayInfo reflectedRay, refractedRay;
		if (!lightScene(rayInfos[i], color, i == 0, reflectedRay, refractedRay)) {
			reflectedRay.attenuation = refractedRay.attenuation = vec3(0.0);
		}
		if (2*i+1 < maxRaysCount) rayInfos[2*i+1] = reflectedRay;
		if (2*i+2 < maxRaysCount) rayInfos[2*i+2] = refractedRay;
	}
		
	return color;
}

//
////////////////////////////////////////////////////////////////

// Returns ray from the eye in the direction to a given pixel
Ray getViewRay() {
	// Computes aspect of rendered rectangle
	float aspect = resolution.x / resolution.y;
	// Computes virtual position of rendered point inside a 2x2 square
	vec2 p = vec2(
		(2.0 * gl_FragCoord.x/resolution.x - 1.0) * aspect,
		 2.0 * gl_FragCoord.y/resolution.y - 1.0
	);
	
	// Defines constant viewpoint at (0,0,4)
	vec3 eye = vec3(0.0, 0.0, 4.0);
	// Defines normalized ray to intersect with scene, from eye to rendered point at z=2
	Ray ray = Ray(eye, normalize(vec3(p, 2.0) - eye));
	
	#ifdef MOUSELOOK
	vec2 mouseCentered = 2.0 * mouse - vec2(1.0);
	float angleX = PI/2.0 + mouseCentered.y * PI/2.0;
	float angleZ = -mouseCentered.x * PI/1.0;
	#else
	float angleX = PI/4.0 + sin(time / sqrt(10.0)) * PI/4.0;
	float angleZ = 0.0;
	#endif
	mat3 R = rotation(vec3(0.0, 0.0, 1.0), angleZ) * rotation(vec3(1.0, 0.0, 0.0), angleX);
	ray = Ray(R * ray.start, normalize(R * ray.direction));
	
	return ray;
}

//out vec4 FragColor;
void main() {
	initScene();
	Ray ray = getViewRay();
	vec3 color = getPixelColor(ray);
	gl_FragColor = vec4(color, 1.0);
}