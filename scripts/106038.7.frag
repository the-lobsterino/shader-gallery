#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
    return a + b * cos(6.28318 * (c * t + d));
}
void main(void) {
    // Calculate normalized coordinates (uv) based on screen position
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;

    // Map uv to the fake 2D cube
    vec2 cubeUV = uv * 2.0 - 1.0;

    // Define the fake rotating cube (2D)
    float cubeSize = 0.1;
    float cubeSpeed = 0.2;
    float cubeRotation = time * cubeSpeed;

    // Apply a fake 2D rotation to the cube
    cubeUV = mat2(cos(cubeRotation), -sin(cubeRotation), sin(cubeRotation), cos(cubeRotation)) * cubeUV;

    // Define the fake diagonals (2D)
    float diagonalSize = 0.7;
    vec2 diagonalCenter = vec2(0.0, 0.0);

    // Apply effects on the fake diagonals
    float diagonal1 = length(cubeUV - diagonalCenter) - diagonalSize;
    float diagonal2 = length(cubeUV + diagonalCenter) - diagonalSize;

    // Apply a fake tiling effect to the cube and diagonals
    cubeUV = fract(cubeUV * 2.0);

    // Adjust the aspect ratio
    cubeUV.x *= resolution.x / resolution.y;

    // Calculate a distance metric from the center of the cube
    float d = length(cubeUV);

    // Modify d using an exponential function
    d *= exp(-length(uv));

    // Create a color based on the modified distance and time
    vec3 col = palette(length(uv) + time,
                      vec3(0.1, 0.1, 0.1),
                      vec3(0.0, 0.1, 0.5),
                      vec3(0.1, 0.2, 0.3),
                      vec3(0.1, 6.1, 0.0));

    // Apply a sinusoidal effect to d and normalize it
    d = sin(d * 1.0 + time * 4.0);
    d = abs(d);
    d = 0.01 / d;

    // Apply effects on the fake diagonals
    float diagonalEffect = min(diagonal1, diagonal2);
    diagonalEffect = smoothstep(0.0, 0.02, diagonalEffect);

    // Combine the cube and diagonal effects
    vec3 final_color = mix(col, col * diagonalEffect, 0.5);

    // Set the fragment color with alpha = 1
    gl_FragColor = vec4(final_color, 1);
}
