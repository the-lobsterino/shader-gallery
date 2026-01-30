#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int ITERATIONS = 40;

vec3 square(vec3 z) {
    return vec3(
                z.x*z.x + z.y*z.y - z.z*z.z,
                2.0 * z.x * z.y,
                2.0 * z.x * z.z
               );
}

void main() {
    vec2 pos = gl_FragCoord.xy/resolution.x-vec2(0.750,0.25);
    pos *= 4.0;
    
    vec3 c = vec3(pos.x, (sin(time)+1.0)*0.75, pos.y);
    vec3 z = c;
    int escapetime = 0;
    
    for (int i = 0; i < ITERATIONS; i++) {
        z = square(z) + c;
        if (abs(z.x) > 10.) {
            escapetime = i;
            break;
        }
    }

    vec3 color = vec3(1.0-exp(-float(escapetime)));
    
    //if (length(pos-vec2(0.30,0)) < c.y || length(pos-vec2(-2,0)) < c.y) color += vec3(1,-1,-1);
    
    gl_FragColor = vec4(color,1.0);
}