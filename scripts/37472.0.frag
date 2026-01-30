precision mediump float;
uniform float time;
uniform vec2 resolution;

#define PI 3.1415926536
#define MARCHING_LOOP_NUM 32
#define HIT_THRESHOLD .001
#define AMBIENT_BRIGHTNESS 0.1
#define NORMAL_DELTA 0.001
#define INVERSE_TRACE_OFFSET 0.1
#define SHADOW_SHARPNESS 10.0


/**
 * Get the fraction part of a number
 */
float frac(float num) {
    float absnum = abs(num);
    return absnum - floor(absnum);
}

/**
 * Get angle in radian from degree
 */
float getRadian(float degree) {
    return PI * degree / 180.0;
}

/**
 * Rotate the vector for a given angle around the given axis.
 * The axis parameter MUST BE normalized.
 */
vec3 rotate(vec3 vector, vec3 axis, float angle) {
    vec3 m = axis * dot(vector, axis);

    vec3 a = vector - m;
    vec3 b = cross(axis, a);

    return m + cos(angle) * a + sin(angle) * b;
}

/**
 * Add yaw(positive for +x -> +z rotation) to the given vector
 */
vec3 addYaw(vec3 vector, float yaw) {
    return rotate(vector, vec3(0.0, 1.0, 0.0), -yaw);
}

/**
 * Add pitch to the given vector
 */
vec3 addPitch(vec3 vector, float pitch) {
    vec3 rotateAxis = addYaw(normalize(vec3(vector.x, 0.0, vector.z)), PI / 2.0);
    return rotate(vector, rotateAxis, pitch);
}

vec2 getNormalizedCoordinate(vec2 rawScreenCoord, vec2 resolution) {
    vec2 resultVec = rawScreenCoord.xy / min(resolution.x, resolution.y);

    if(resolution.x > resolution.y) {
        resultVec -= 0.5 * vec2(resolution.x / resolution.y, 1.0);
    } else {
        resultVec -= 0.5 * vec2(1.0, resolution.y / resolution.x);
    }

    return resultVec;
}

/**
 * Get the color of the floor(X-Z plane) at given coordinate
 */
vec3 getFloorColor(vec2 coord) {
    vec3 resultVec = vec3(1.0);
    if(frac(coord.x) < 0.025 || frac(coord.y) < 0.025) {
        resultVec -= vec3(0.9);
    }

    if(coord.x < 0.0) {
        resultVec -= vec3(0.05);
    }

    if(coord.y < 0.0) {
        resultVec -= vec3(0.05);
    }

    return resultVec;
}
vec3 getFloorColor(vec3 coord) {
    return getFloorColor(coord.xz);
}

/**
 * Get the collision location between the ray and the x-z plane
 */
vec3 getCollisionToXZPlane(vec3 rayOrigin, vec3 ray){
    return rayOrigin + ray * (rayOrigin.y / (-ray.y));
}

float getDistanceToSphere(vec3 rayPosition, float radius) {
    return length(rayPosition) - radius;
}

float getDistanceToObjects(vec3 rayPosition) {
    return getDistanceToSphere(rayPosition - vec3(0., 1., 0.), 1.0);
}

vec3 getNormalAt(vec3 objectSurface) {
    vec3 dx = vec3(NORMAL_DELTA, 0.0, 0.0);
    vec3 dy = vec3(0.0, NORMAL_DELTA, 0.0);
    vec3 dz = vec3(0.0, 0.0, NORMAL_DELTA);

    return normalize(vec3(
                getDistanceToObjects(objectSurface + dx) - getDistanceToObjects(objectSurface - dx),
                getDistanceToObjects(objectSurface + dy) - getDistanceToObjects(objectSurface - dy),
                getDistanceToObjects(objectSurface + dz) - getDistanceToObjects(objectSurface - dz)
           ));
}

float getBrightnessWithAmbience(float brightness) {
    return brightness * (1.0 - AMBIENT_BRIGHTNESS) + AMBIENT_BRIGHTNESS;
}

vec3 getBrightnessWithAmbience(vec3 color) {
    return color * (1.0 - AMBIENT_BRIGHTNESS) + AMBIENT_BRIGHTNESS;
}

float getBrightnessAt(vec3 rayPosition, vec3 lightRayDirection) {
    return getBrightnessWithAmbience(clamp(dot(getNormalAt(rayPosition), lightRayDirection), 0.0, 1.0));
}

vec3 getRayPositionClosestToObject(vec3 startVec, vec3 normalizedRay) {
    vec3 rayTip = vec3(startVec);
    float prevDistance = getDistanceToObjects(rayTip);

    for(int i = 0; i < MARCHING_LOOP_NUM; i++) {
        float distance = getDistanceToObjects(rayTip);

        if(distance > prevDistance) {
            break;
        }

        rayTip += normalizedRay * distance;
    }

    return rayTip;
}

float getShadowCoefficientAt(vec3 objectSurface, vec3 inverseLightRay) {
    float rayDisplacement = INVERSE_TRACE_OFFSET;
    float brightness = 1.0;

    for(int i = 0; i < MARCHING_LOOP_NUM; i++) {
        float distance = getDistanceToObjects(objectSurface + rayDisplacement * inverseLightRay);
        if (distance < HIT_THRESHOLD) {
            return 1.0;
        }

        brightness = min(brightness, distance * SHADOW_SHARPNESS / rayDisplacement);
        rayDisplacement += distance;
    }

    return 1.0 - brightness;
}

vec3 getShadowBlendedColor(vec3 color, float shadowCoefficient) {
    return color * getBrightnessWithAmbience((1.0 - shadowCoefficient));
}

void main(){
    // screen initialization
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 screenCoord = getNormalizedCoordinate(gl_FragCoord.xy, resolution);

    // camera initialization
    vec3 cameraPosition = vec3(10. * sin(time * 0.75), 2.5, 10.0 * cos(time * 0.75));
    vec3 cameraTarget = vec3(0.0, 2.0, 0.0);
    vec3 centerRay = normalize(cameraTarget - cameraPosition);
    float fov = getRadian(60.0);

    // ray initialization
    vec3 vScreenYUnit = addPitch(centerRay, PI / 2.0);
    vec3 vScreenXUnit = cross(centerRay, vScreenYUnit);
    float distanceToVScreen = 1.0 / tan(fov / 2.0);
    // intersection of ray and virtually emulated projection screen placed in local space
    vec3 vScreenIntersection = distanceToVScreen * centerRay + screenCoord.x * vScreenXUnit + screenCoord.y * vScreenYUnit;
    vec3 ray = normalize(vScreenIntersection);

    // light initialization
    vec3 lightRayDirection = normalize(vec3(-1., 3., 2.));

    bool didCollideToObject = false;

    vec3 rayTip = getRayPositionClosestToObject(cameraPosition, ray);

    // if the ray is hit
    if (getDistanceToObjects(rayTip) < HIT_THRESHOLD) {
        didCollideToObject = true;

        gl_FragColor = vec4(vec3(getBrightnessAt(rayTip, lightRayDirection)), 1.0);
    }

    // render the floor
    if (rayTip.y < 0.0 || (!didCollideToObject && ray.y < 0.0)) {
        vec3 collisionLoc = getCollisionToXZPlane(cameraPosition, ray);
        vec3 floorColor = getFloorColor(collisionLoc);
        float shadowCoeff = getShadowCoefficientAt(vec3(collisionLoc.x, 0.0, collisionLoc.z), lightRayDirection);
        gl_FragColor = vec4(getShadowBlendedColor(floorColor, shadowCoeff), 1.0);
    }
}