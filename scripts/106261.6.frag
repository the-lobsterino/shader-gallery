#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int MAX_STEPS = 200;
const float MIN_DIST = 0.001;
const float MAX_DIST = 150.0;



// Scene Setup
vec3 box1Pos = vec3(-2.0, 0.5, -5.0);
vec3 box2Pos = vec3(0.0, 0.5, -10.0);
vec3 box3Pos = vec3(2.0, 0.5, -15.0);
float boxSize = 1.0;

// Lighting
vec3 lightPos = vec3(0.0, 5.0, -10.0);

float boxSDF(vec3 p, vec3 bPos) {
    vec3 d = abs(p - bPos) - vec3(boxSize);
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float planeSDF(vec3 p) {
    return p.y;
}

float customLength(vec3 vec) {
    return sqrt(dot(vec, vec));
}

float sceneSDF(vec3 p) {
    return min(planeSDF(p), min(boxSDF(p, box1Pos), min(boxSDF(p, box2Pos), boxSDF(p, box3Pos))));
}

float movingPlaneSDF(vec3 p) {
    float planeSpeed = 4.0; // Adjust to make the plane move faster or slower
    float maxDistance = 300.0; // Adjust to make the plane move further out before returning
    float oscillatingMovement = abs(mod(planeSpeed * time, 2.0 * maxDistance) - maxDistance);
    float planeZ = 0.1 + oscillatingMovement;
    return p.z - planeZ;
}

vec3 getNormal(vec3 p) {
    vec2 eps = vec2(0.001, 0.0);
    vec3 n = vec3(sceneSDF(p + eps.xyy) - sceneSDF(p - eps.xyy),
                  sceneSDF(p + eps.yxy) - sceneSDF(p - eps.yxy),
                  sceneSDF(p + eps.yyx) - sceneSDF(p - eps.yyx));
    return normalize(n);
}

vec3 blinnPhong(vec3 p, vec3 n, vec3 l, vec3 v) {
    vec3 h = normalize(v + l);
    float diff = max(dot(n, l), 0.0);
    float spec = pow(max(dot(n, h), 0.0), 16.0);
    return vec3(0.4) * diff + vec3(0.6) * spec;
}


void main( void ) {
    vec3 camPos = vec3(0.0, 1.0, 0.0);
    vec2 position = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5);
    vec3 rayDir = normalize(vec3(position, -1.0));

    vec3 p = camPos;
    float totalDist = 0.0;  // Accumulated distance
    bool hit = false;
    for (int i = 0; i < int(MAX_STEPS); i++) {
        float sceneDistance = sceneSDF(p);
        float planeDistance = movingPlaneSDF(p);
        
        if (sceneDistance < planeDistance) {
            if (sceneDistance < MIN_DIST) {
                vec3 norm = getNormal(p);
                vec3 lightDir = normalize(lightPos - p);
                gl_FragColor = vec4(blinnPhong(p, norm, lightDir, -rayDir), 1.0);
                hit = true;
                break;
            }
            p += rayDir * sceneDistance;
            totalDist += sceneDistance;
        } else {
            if (planeDistance < MIN_DIST) {
                gl_FragColor = vec4(0.0, 1.0, 0.0, 0.1);  // 10% opaque green for the plane
                hit = true;
                break;
            }
            p += rayDir * planeDistance;
            totalDist += planeDistance;
        }
        
        if (totalDist > MAX_DIST) break;
    }
    
    if (!hit) {
        gl_FragColor = vec4(0.5, 0.2, 0.7, 0.4);  // Background color
    }
}