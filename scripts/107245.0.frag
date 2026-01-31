#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

void main(void) {
    vec2 coord = (gl_FragCoord.xy / u_resolution) * 10.0;

    vec3 blackColor = vec3(0.0, 0.0, 0.0);
    vec3 whiteColor = vec3(1.0, 1.0, 1.0);
    vec3 color = blackColor; // Default color as black for the outside grid.

    if (coord.x > 1.0 && coord.x < 9.0 && coord.y > 1.0 && coord.y < 9.0) {
        // If we are inside the 8x8 square:
        
        // Check for border
        if (coord.x <= 2.0 || coord.x >= 8.0 || coord.y <= 2.0 || coord.y >= 8.0) {
            color = blackColor;
        } else {
            // Checkered pattern
            if (mod(floor(coord.x - 2.0) + floor(coord.y - 2.0), 2.0) == 0.0) {
                color = whiteColor;
            } else {
                color = blackColor;
            }
        }
    }

    gl_FragColor = vec4(color, 1.0);
}