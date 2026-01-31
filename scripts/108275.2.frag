#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;

// Ray-sphere intersection
float sphereIntersect(vec3 rayOrigin, vec3 rayDir, vec3 sphereCenter, float sphereRadius) {
    vec3 oc = rayOrigin - sphereCenter;
    float b = dot(oc, rayDir);
    float c = dot(oc, oc) - sphereRadius * sphereRadius;
    float h = b * b - c;
    if (h < 0.0) return -1.0;
    return -b - sqrt(h);
}

void main(void) {
    vec2 uv = (gl_FragCoord.xy / resolution.xy) - 0.5;
    uv.x *= resolution.x / resolution.y;
    vec3 rayOrigin = vec3(0.0, 0.0, 1.0);
    vec3 rayDir = normalize(vec3(uv, -1.0));

    float t = sphereIntersect(rayOrigin, rayDir, vec3(0.0), 0.5);
    if (t > 0.0) {
        vec3 hit = rayOrigin + rayDir * t;
        vec3 norm = normalize(hit);
        vec3 lightDir = normalize(vec3(0.5, 0.5, -1.0));
        float diff = max(dot(norm, lightDir), 0.0);
        gl_FragColor = vec4(diff, diff, diff, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
