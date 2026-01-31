// Author: Ulti
// Title:  Squircle demostration

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.xy *= 2.;
    st.xy -= 1.;
    st.x *= u_resolution.x / u_resolution.y;
    // st - current pixel coord between -1 and 1 (if the canvas is perfectly square)
    

    vec3 color = vec3(0.0);
    // just for demonstration
    float magic_number = abs(sin(u_time / 4.123));    
    // the more red, the lower magic_number is,
    // the more green, the higher magic_number is
    color = vec3(mix(1., 0., magic_number), mix(0., 1., magic_number), 0);
    
    float size = magic_number / 2. + .5;
    if (
        pow(abs(st.x / size), magic_number * 4.321 + .5) + // random numbers are
        pow(abs(st.y / size), magic_number * 4.321 + .5) < // just for showcase purposes
        pow(           size,  magic_number * 4.321 + .5)
    )
        color = vec3(1); // colors here are between 0 and 1, not 0 and 255!

    gl_FragColor = vec4(color,1.0);
}