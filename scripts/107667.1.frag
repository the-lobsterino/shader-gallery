#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

#define MAX_STEPS 200
#define MIN_DIST 0.0001
#define zoom 0.7
#define PI 3.14159265359

// Simple Perlin noise function
float snoise(vec2 v) {
    return fract(dot(v, vec2(12.9898, 78.233)) * 43758.5453);
}

// Function for a 3D fractal
float mandelbulb(vec3 p) {
    vec3 z = p;
    float dr = 1.0;
    float r = 0.0;

    for (int i = 0; i < MAX_STEPS; i++) {
        r = length(z);
        if (r > 2.0) break;

        float theta = acos(z.z / r);
        float phi = atan(z.y, z.x);
        dr = pow(r, 7.0) * 6.0 * dr + 1.0;

        float zr = pow(r, 8.0) * sin(8.0 * theta) * cos(8.0 * phi);
        float zi = pow(r, 8.0) * sin(8.0 * theta) * sin(8.0 * phi);
        float cr = zr + p.x;
        float ci = zi + p.y;
        r = length(vec2(cr, ci));
        float c = length(vec2(cr, ci));

        theta = atan(c, z.z);
        phi = atan(ci, cr);
        z = vec3(zr, zi, z.z) + vec3(cr, ci, c);

        dr = dr * 8.0 * pow(r, 7.0) - 1.0;
    }

    return 0.5 * log(r) * r / dr;
}

// Function for refraction
vec3 fract(vec3 I, vec3 N, float eta) {
    float k = 1.0 - eta * eta * (1.0 - dot(N, I) * dot(N, I));
    if (k < 0.0)
        return vec3(0.0);
    else
        return eta * I - (eta * dot(N, I) + sqrt(k)) * N;
}

void main() {
    // Normalized pixel coordinates (from -1 to 1)
    vec2 p = (2.0 * gl_FragCoord.xy - resolution) / min(resolution.y, resolution.x);
    p.x *= resolution.x / resolution.y;

    vec3 cameraPos = vec3(0.0, 0.0, -3.0);
    vec3 cameraUp = vec3(0.0, 1.0, 0.0);
    vec3 cameraTarget = vec3(0.0, 0.0, 0.0);
    vec3 cameraDir = normalize(cameraTarget - cameraPos);
    vec3 cameraRight = cross(cameraUp, cameraDir);
    vec3 cameraUpWorld = cross(cameraDir, cameraRight);
    vec3 cameraOrigin = cameraPos;

    // Ray setup
    vec3 rayOrigin = cameraOrigin;
    vec3 rayDir = normalize(cameraRight * p.x + cameraUpWorld * p.y + cameraDir * zoom);

    // Ray marching
    float distance = 0.0;
    vec3 pos = cameraPos;

    for (int i = 0; i < MAX_STEPS; i++) {
        distance = mandelbulb(pos);
        if (distance < MIN_DIST) break;
        pos += rayDir * distance;
    }

    // Calculate normal
    vec3 epsilon = vec3(MIN_DIST);
    vec3 normal = normalize(vec3(
        mandelbulb(pos + epsilon.xyy) - mandelbulb(pos - epsilon.xyy),
        mandelbulb(pos + epsilon.yxy) - mandelbulb(pos - epsilon.yxy),
        mandelbulb(pos + epsilon.yyx) - mandelbulb(pos - epsilon.yyx)
    ));

    // Lighting
    vec3 lightDir = normalize(vec3(0.7, 0.7, 0.0));
    float diff = max(dot(normal, lightDir), 0.1);
    vec3 lightColor = vec3(1.0, 1.0, 0.8);
    vec3 objectColor = vec3(0.8, 0.2, 0.2);
    vec3 ambientColor = vec3(0.2, 0.2, 0.2);

    // Refraction
    float eta = 1.0 / 1.5;
    vec3 refractionDir = refract(rayDir, normal, eta);
    vec3 refractionPos = pos + normal * MIN_DIST * 10.0;
    

    // Final color
    vec3 color = (objectColor * lightColor * diff + ambientColor) * 0.7;

    // Output to screen
    gl_FragColor = vec4(color, 1.0);
}