#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 fragCoord; // Add a varying variable to pass the fragment coordinates to JavaScript.

void main(void) {
    vec2 position = (gl_FragCoord.xy / resolution.xy) + mouse / 4.0;

    // Your existing shader code here...

}
