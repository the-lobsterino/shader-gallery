precision highp float;

// Uniform declarations
uniform vec2 resolution;      
uniform vec2 keypoints[17];   // Adjust this size if you have a different number of keypoints

// Constant for the tracer effect
const float TRACER_RADIUS = 0.05;  // Making the threshold a named constant for clarity

// Function to compute the tracer effect for a given keypoint
vec3 computeTracerEffect(vec2 uv, vec2 keypoint) {
    float distanceToKeyPoint = length(uv - keypoint);
    
    if(distanceToKeyPoint < TRACER_RADIUS) {
        float intensity = 1.0 - distanceToKeyPoint / TRACER_RADIUS;
        return vec3(intensity);   // Using vec3 constructor for concise code
    }
    return vec3(0.0);   // Black color
}

void main(void) {
    vec2 normalizedUV = gl_FragCoord.xy / resolution;
    vec3 accumulatedColor = vec3(0.0);

    for(int i = 0; i < 17; i++) {
        accumulatedColor += computeTracerEffect(normalizedUV, keypoints[i]);
    }

    gl_FragColor = vec4(accumulatedColor, 1.0);   // Fully opaque color
}

