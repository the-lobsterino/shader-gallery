#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
    float angle = time * 2.0;
    float size = 0.25;
    float dist = 0.0;

    // Rotate the cube
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    position = rot * position;

    // Check if the cube is inside the rotated cube
    vec3 cube = abs(vec3(position.xy, 0.5));
    float distCube = max(cube.x, max(cube.y, cube.z));

    // Check if the cube is inside the rotated cube
    vec3 sphere = vec3(length(position) * 2.0, 0.5, 0.5);
    float distSphere = length(sphere);

    // Combine the cube and sphere distances
    dist = max(distCube, distSphere);

    // Calculate the final color
    vec3 color = vec3(0.0);
    if (dist < size) {
        color = vec3(1.0);
    }

    // Add the rainbow effect
    color = clamp(color + vec3(0.0, 0.5, 1.0) * (1.0 - dist / size), 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
}