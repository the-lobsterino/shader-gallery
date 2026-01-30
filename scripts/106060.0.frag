#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;   // time variable
uniform vec2 u_resolution; // screen resolution

const float PHI = 1.61803398875; // Golden ratio

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st = st * 2.0 - 1.0;

    // Convert Cartesian to polar coordinates
    float r = length(st);
    float theta = atan(st.y, st.x);

    // Modulate the angle with time and golden ratio
    float spiral = mod(theta + u_time + r*5.0, PHI) - PHI/2.0;

    // Define color gradients based on the golden ratio spiral
    vec3 color;
    color.r = abs(sin(spiral*5.0)) * 0.5 + 0.5;
    color.g = abs(sin(spiral*5.0 + 2.0*PI/3.0)) * 0.5 + 0.5;
    color.b = abs(sin(spiral*5.0 + 4.0*PI/3.0)) * 0.5 + 0.5;

    gl_FragColor = vec4(color,1.0);
}
