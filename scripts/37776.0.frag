#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float leafs = 4.0;
//from tutorial created by iq
vec3 computeColor(vec2 p) {
    float ratio = resolution.x / resolution.y;
    p.y = p.y / ratio;
    p /= 0.4;
    p -= vec2(0.5*ratio, 1.1 / ratio);
    float r = sqrt(dot(p, p));
    float a = atan(p.y, p.x) + time * 0.2;
    float s = 0.5 + 0.5 * sin(leafs * a);
    float t = 0.15 + 0.35*pow(s, 0.3);
    t += 0.1 * pow(0.5 + 0.5 * cos(leafs * 2.0 * a), 0.5);
    float h = r / t;
    float f = 0.0;
    if (h < 1.0) {
        f = 1.0;
    } else {
        f = 0.3;
        h = 2.0;
    }
    
    return mix(vec3(1.0), vec3(0.5 * h, 0.5 + 0.5 * h, 0.0), f);
}

void main( void )
{
    vec2 uv = vec2(gl_FragCoord.x / resolution.x, gl_FragCoord.y  / resolution.y);
    vec3 res = computeColor(uv);
    gl_FragColor = vec4(res.rgb,2.0);
}