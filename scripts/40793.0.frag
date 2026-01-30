#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 white = vec3(1.0, 1.0, 1.0);
const vec3 red   = vec3(1.0, 0.0, 0.0);
const vec3 green = vec3(0.0, 1.0, 0.0);
const vec3 blue  = vec3(0.0, 0.0, 1.0);

bool inCircle(vec2 position, vec2 offset, float size) {
    float len = length(position - offset);
    if (len < size) {
        return true;
    }
    return false;
}

bool inRect(vec2 position, vec2 offset, float size) {
    vec2 q = (position - offset) / size;
    if (abs(q.x) < 1.0 && abs(q.y) < 1.0) {
        return true;
    }
    return false;
}

bool inEllipse(vec2 position, vec2 offset, vec2 prop, float size) {
    vec2 q = (position - offset) / prop;
    if (length(q) < size) {
        return true;
    }
    return false;
}

void main( void ) {
    vec3 destColor = white;
    vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    if (inCircle (position, vec2(1.0, 1.0), 0.1)) {
        destColor *= red;
    }

    if (inRect(position, vec2( 0.5, -0.5), 0.25)) {
        destColor *= blue;
    }
    if (inEllipse(position, vec2(-0.5, -0.5), vec2(1.0, 1.0), 0.2)) {
        destColor *= green;
    }
    gl_FragColor = vec4(destColor, 1.0);
}