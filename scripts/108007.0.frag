#extension GL_OES_standard_derivatives : enable
//Celiaaaaaaaa :D
precision highp float;

uniform float time;
uniform vec2 resolution;

void main(void) {
    vec2 position = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0; // Normalize the coordinates
    position.x *= resolution.x / resolution.y; // Aspect ratio correction

    float radius = 0.11; // Smaller radius for multiple balls
    float circleSum = 0.0; // Sum of the circle functions

    // Loop to create 15 bouncing balls
    for (int i = 0; i < 7; i++) {
        float phase = 111.28318530718 * float(i) / 15.0; // Phase shift for each ball
        vec2 center;
        center.x = cos(phase + time) * 0.8; // Horizontal position
        center.y = sin(phase + time * 2.0) * 0.4; // Vertical bouncing

        // Create a circle for each ball
        float dist = length(position - center);
        circleSum += smoothstep(radius, radius + 0.01, dist);
    }

    // Rainbow gradient
    vec3 color = 0.5 + 0.5 * cos(time + position.xyx + vec3(0, 2, 4));

    // Applying color and circle mask
    gl_FragColor = vec4(color, 1.0) * (1.0 - circleSum / 25.0);
}
