#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 white = vec3(1.0, 1.0, 1.0);
const vec3 red   = vec3(0.0, 1.0, 1.0);
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
    vec3 destColor = blue+white;
    vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    for(float i = 0.0; i < 28.0; i++){
        if (inCircle (position, vec2(-1.8+i*i*0.005,0.08*sin(i+time*5.0)*2.0), 0.4)) {
            destColor *= 0.04*i+vec3(sin(time*3.0), 0.8, 0.1);
        }
    }

    
    gl_FragColor = vec4(destColor, 1.0);
}
