#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    vec3 color = vec3(0.);

    // Define the square by setting a range for st.x and st.y
    float squareSize = 0.2;

    // Adjust square size based on mouse position
    float mouseX = u_mouse.x / u_resolution.x;
    float mouseY = 1.0 - u_mouse.y / u_resolution.y;

    float offsetX = 0.5 - mouseX;
    float offsetY = 0.5 - mouseY;

    float adjustedSizeX = squareSize / 2.0;
    float adjustedSizeY = squareSize / 2.0;

    if (st.x > 0.5 - adjustedSizeX && st.x < 0.5 + adjustedSizeX &&
        st.y > 0.5 - adjustedSizeY && st.y < 0.5 + adjustedSizeY) {
        // Set color to white for the square
        color = vec3(1.0);

        // Adjust square size based on mouse position
        adjustedSizeX += offsetX;
        adjustedSizeY += offsetY;
    }

    gl_FragColor = vec4(color, 1.0);
}
