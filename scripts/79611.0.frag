#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

void main() {

    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;

    int size = 2 * int(min(resolution.x, resolution.y) / 4.5);

    float t = sin(time + distance(p, vec2(0.)));

    vec2 tailoff = vec2(float(size) / (1.0 + sin(t)),
        tan((t - sin(t)) * 6.283185307179586476925286766559));

    gl_FragColor = vec4(sin(length(p - tailoff)), cos(length(p - tailoff)), sin(length(p)), 1.0);
}

