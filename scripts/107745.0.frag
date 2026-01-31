#ifdef GL_ES
precision mediump float;
#endif

uniform float time; // The rhythmic heartbeat of our temporal escapade
uniform vec2 resolution; // The wrist-mounted canvas for our visual symphony

void main() {
    vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0; // Coordinate magic
    uv.x *= resolution.x / resolution.y; // Aspect ratio adjustment

    // A dance of lights and shadows, with colors as lively as a pixie's dream
    float colorR = 0.5 + 0.5 * cos(time + length(uv) * sin(time) * 2.0);
    float colorG = 0.5 + 0.5 * sin(time + uv.x + uv.y);
    float colorB = 0.5 + 0.5 * cos(time + atan(uv.y, uv.x));

    // Blending the spectrum into a mesmerizing whirl of time-transcending hues
    vec3 color = vec3(colorR, colorG, colorB);

    // Before us shall unfold a masterpiece of chromatic wonderment
    gl_FragColor = vec4(color, 1.0);
}