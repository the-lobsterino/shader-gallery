uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

in vec3 vertexPosition;

out vec4 fragmentColor;

const int MAX_RAY_DEPTH = 5;

struct Ray {
    vec3 origin;
    vec3 direction;
};

struct SceneObject {
    vec3 position;
    vec3 color;
};

SceneObject sceneObject;

// Funkcja śledząca promień
bool trace(Ray ray, inout vec3 color, int depth) {
    if (depth > MAX_RAY_DEPTH) {
        return false;
    }

    float t = intersectSphere(ray, sceneObject.position, 1.0);

    if (t > 0.0) {
        vec3 hitPoint = ray.origin + ray.direction * t;
        vec3 normal = normalize(hitPoint - sceneObject.position);
        color = sceneObject.color * max(dot(normal, -ray.direction), 0.0);
        return true;
    }

    return false;
}

// Funkcja obliczająca przecięcie sfery
float intersectSphere(Ray ray, vec3 sphereCenter, float sphereRadius) {
    vec3 L = sphereCenter - ray.origin;
    float tca = dot(L, ray.direction);
    if (tca < 0) {
        return -1.0;
    }
    float d2 = dot(L, L) - tca * tca;
    if (d2 > sphereRadius * sphereRadius) {
        return -1.0;
    }
    float thc = sqrt(sphereRadius * sphereRadius - d2);
    float t0 = tca - thc;
    float t1 = tca + thc;
    if (t0 > t1) {
        float temp = t0;
        t0 = t1;
        t1 = temp;
    }
    if (t0 < 0) {
        t0 = t1;
        if (t0 < 0) {
            return -1.0;
        }
    }
    return t0;
}

void main() {
    vec4 worldPosition = modelMatrix * vec4(vertexPosition, 1.0);
    Ray ray;
    ray.origin = vec3(viewMatrix * vec4(0.0, 0.0, 0.0, 1.0));
    ray.direction = normalize(worldPosition.xyz - ray.origin);
    trace(ray, fragmentColor.rgb, 0);
    fragmentColor.a = 1.0;
}