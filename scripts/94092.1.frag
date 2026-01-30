#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float DENSITY = 0.1;
const vec3 STAR_COLOR = vec3(1.0);

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void point(vec2 pos) {
    pos *= resolution;

    float d = distance(gl_FragCoord.xy, pos);
    gl_FragColor.rgb += smoothstep(4.0, 0.0, d) * STAR_COLOR;
}

void stars() {
    for (int i = 1; i < 70; i++) {
        float sx = rand(vec2(-i, i));
        float sy = rand(vec2(sx, -sx));
        point(vec2(sx, sy));
    }
}

void main() {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 res = 1.0 / resolution;
    stars();
}