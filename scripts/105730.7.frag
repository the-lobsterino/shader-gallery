#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

const vec3 sunColor = vec3(1.0, 0.8, 0.2);
const vec3 skyColorDay = vec3(0.5, 0.7, 1.0);
const vec3 skyColorSunset = vec3(1.0, 0.4, 0.2);
const float cloudSpeed = 10.0;

// Function to simulate clouds
float clouds(vec2 uv) {
    return 0.5 * sin(time * cloudSpeed + uv.x * 10.0) +
           0.3 * cos(time * cloudSpeed * 0.7 + uv.y * 8.0);
}

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // Calculate the sky color based on the sun's position
    vec3 skyColor = mix(skyColorDay, skyColorSunset, uv.y);

    // Calculate the position of the sun
    float sunPosition = clamp(time / 10.0, 0.0, 1.0);
    vec3 sunPositionColor = mix(vec3(0.0), sunColor, sunPosition);

    // Simulate clouds
    float cloudiness = clouds(uv);

    // Combine sky color, sun, and clouds
    vec3 color = mix(skyColor, sunPositionColor, 1.0 - cloudiness);

    gl_FragColor = vec4(color, 1.0);
}
