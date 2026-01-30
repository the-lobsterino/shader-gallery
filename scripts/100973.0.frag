#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

const float MAX_DISTANCE = 100.0;
const float MIN_DISTANCE = 0.001;
const int MAX_STEPS = 100;

struct Material {
    vec3 color;
    float reflection;
};

struct Sphere {
    vec3 position;
    float radius;
    Material material;
};

struct Light {
    vec3 position;
    vec3 color;
    float intensity;
};

struct Ray {
    vec3 origin;
    vec3 direction;
};

struct Intersection {
    float distance;
    Material material;
};

Sphere sphere;
Light light;

float sphereDistance(vec3 position) {
    return length(position - sphere.position) - sphere.radius;
}

Intersection getIntersection(Ray ray) {
    float totalDistance = 0.0;
    Intersection intersection;

    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 currentPosition = ray.origin + totalDistance * ray.direction;
        float distance = sphereDistance(currentPosition);

        if (distance < MIN_DISTANCE) {
            intersection.distance = totalDistance;
            intersection.material = sphere.material;
            return intersection;
        }

        totalDistance += distance;
        if (totalDistance > MAX_DISTANCE) break;
    }

    intersection.distance = -1.0;
    return intersection;
}

vec3 getNormal(vec3 position) {
    float d = sphereDistance(position);
    vec2 e = vec2(MIN_DISTANCE, 0.0);

    return normalize(d - vec3(
        sphereDistance(position - e.xyy),
        sphereDistance(position - e.yxy),
        sphereDistance(position - e.yyx)));
}

float calculateLighting(vec3 position, vec3 normal) {
    vec3 lightDirection = normalize(light.position - position);
    float diffuse = max(0.0, dot(normal, lightDirection));

    return light.intensity * diffuse;
}

vec3 raymarch(Ray ray) {
    vec3 background = vec3(0.2, 0.5, 0.7);
    vec3 ambientColor = vec3(0.1, 0.1, 0.1);

    Intersection intersection = getIntersection(ray);
    if (intersection.distance == -1.0) return background;

    vec3 position = ray.origin + intersection.distance * ray.direction;
    vec3 normal = getNormal(position);

    vec3 lightColor = light.color * calculateLighting(position, normal);
    vec3 objectColor = intersection.material.color * ambientColor + lightColor;

    return objectColor;
}

void mainImage(out vec4 fragColor, vec2 fragCoord) {
    vec2 uv = (fragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

    Ray ray;
    ray.origin = vec3(0.0, 0.0, 5.0);
    ray.direction = normalize(vec3(uv, -1.0));

    sphere.position = vec3(0.0, 0.0, 0.0);
    sphere.radius = 1.0;
    sphere.material.color = vec3(0.8, 0.2, 0.2);
    sphere.material.reflection = 0.5;

    light.position = vec3(2.0, 2.0, 3.0);
    light.color = vec3(1.0, 1.0, 1.0);
    light.intensity = 3.0;

    vec3 color = raymarch(ray);
    fragColor = vec4(color, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}