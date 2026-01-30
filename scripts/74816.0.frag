precision highp float;

uniform vec2 resolution;
varying vec2 surfacePosition;

float sphereSize = 0.6;

float sphereDistanceFunction(vec3 position, float size) {
    return length(position) - size;
}

vec3 normal(vec3 pos, float size) {
    float v = 0.001;
    return normalize(vec3(sphereDistanceFunction(pos, size) - sphereDistanceFunction(vec3(pos.x - v, pos.y, pos.z), size), sphereDistanceFunction(pos, size) - sphereDistanceFunction(vec3(pos.x, pos.y - v, pos.z), size), sphereDistanceFunction(pos, size) - sphereDistanceFunction(vec3(pos.x, pos.y, pos.z - v), size)));
}

void main( void ) {
    vec2 position = surfacePosition;//(gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    vec3 cameraPosition = vec3(0.0, 0.0, 10.0);
    float screenZ = 4.0;

    vec3 lightDirection = normalize(vec3(0.0, 0.0, 1.0));
    vec3 rayDirection = normalize(vec3(position, screenZ) - cameraPosition);
    vec3 color = vec3(0.0);
    float depth = 0.0;

    for (int i = 0; i < 99; i++) {//rays loop
        vec3 rayPosition = cameraPosition + rayDirection * depth;   
        float dist = sphereDistanceFunction(rayPosition, sphereSize);

        if (dist < 0.0001) {
            vec3 normal = normal(cameraPosition, sphereSize);
            float differ = dot(normal, lightDirection);
            color = vec3(differ)-vec3(0,1,0);
            break;
        }

        cameraPosition += rayDirection * dist;
    }

    gl_FragColor = vec4(color, 1.0);
}