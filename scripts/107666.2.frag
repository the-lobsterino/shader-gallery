#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate2D(float r) {
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}

float textFunction(vec2 p) {
    // Define the word to wrap around
    const float wordWidth = 0.1;
    const float wordPosition = 0.5;
    float distanceToWord = abs(p.x - wordPosition);

    // Create a smooth step transition for the word
    float word = smoothstep(0.0, wordWidth, distanceToWord);
    
    // Apply some variations to the word to make it interesting
    float wordEffect = sin(p.y * 30.0) * 0.1;
    
    return word * wordEffect;
}

void main(void) {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
    vec3 col = vec3(0);
    float t = time * 0.03; // Adjust the time factor for faster animation

    vec2 n = vec2(5);
    vec2 q = vec2(0);
    vec2 p = uv;
    float d = dot(p, p);
    float S = 5.0;
    float a = 0.0;
    mat2 m = rotate2D(7.0);

    for (float j = 0.0; j < 20.0; j++) {
        p *= m;
        n *= m;
        q = p * S + t * 4.0 + sin(t * 4.0 - d * 6.0) * 0.8 + j + n;
        a += dot(cos(q) / S, vec2(0.2));
        n -= sin(q);
        S *= 1.2;
    }

    // Displace the pixels based on the word "favright"
    float wordDisplacement = textFunction(uv);

    // Apply the displacement to the color
    col = vec3(3, 0.0, 0.0) * (a + 0.2 + wordDisplacement) + a + a - d;

    // Output to screen
    gl_FragColor = vec4(col, 1.0);
}                