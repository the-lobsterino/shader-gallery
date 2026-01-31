// Author: Ulti
// Title:  Squircle demostration

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

void main() {
    // gl_FragCoord (if I'm not mistaken) is the same as p5.js's x and y
    vec2 st = gl_FragCoord.xy / resolution.xy;
    st.xy *= 2.;
    st.xy -= 1.;
    st.x *= resolution.x / resolution.y;
    // st - current pixel coord between -1 and 1 (if the canvas is perfectly square)
    

    vec3 color = vec3(0.0);
    // just for demonstration
    float magic_number = abs(sin(time / 4.123));    
    // the more red, the lower magic_number is,
    // the more green, the higher magic_number is
    color = vec3(mix(1., 0., magic_number), mix(0., 1., magic_number), 0);
    
    float size = magic_number / 2. + .5;
    if (
        pow(abs(st.x / size), magic_number * 4.321 + .5) + // random numbers are
        pow(abs(st.y / size), magic_number * 4.321 + .5) < // just for showcase purposes
        pow(           size,  magic_number * 4.321 + .5)
    )
        color = vec3(0., 0., 0.8); // colors here are between 0 and 7, not 0 and 255!

    gl_FragColor = vec4(color,1.0);
}