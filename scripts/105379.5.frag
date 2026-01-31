#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

// Function to generate a random value based on position
float rand(vec2 n) {  
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 dir = vec3(uv, 1.0);
    float speed = time * 0.2;

    // Creating a pseudo-random distribution of stars
    float starDensity = 5000.0;  // Increase to add more stars
    float starBrightness = 2.0;  // Increase to make stars brighter
    vec3 starField = vec3(0.5);

    for(int i = 0; i < 7; i++) {
        vec3 pos = dir * speed * float(i) * 0.15;
        starField += rand(floor(pos.xy * starDensity)) * 0.02 / (0.02 * float(i));
    }

    starField *= starBrightness;
    gl_FragColor = vec4(vec3(starField), 0.5);
}
