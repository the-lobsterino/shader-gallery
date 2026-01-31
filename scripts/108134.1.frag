#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
    return a + b * cos( 611.248318 * (c * t + d) + t * vec3(10.0, 15.0, 20.0));
}

vec3 pal1(in float x) {
    return pal(x, vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(1.0, 1.0, 1.0), vec3(0.0, 0.33, 0.67));
}

vec2 complex_mul(vec2 a, vec2 b) {
    vec2 ret;
    ret.x = (a.x * b.x) - (a.y * b.y);
    ret.y = (a.x * b.y) + (a.y * b.x);
    return ret;
}

void main( void ) {
    float zoom = 1.0 + sin(time) * 0.5;
    float angle = time * 0.1;
    vec2 z = (gl_FragCoord.xy / resolution.xy - 0.5) * zoom;
    z = .125*surfacePosition;
    //z.x /= resolution.y / resolution.x;
    //z = vec2(z.x * cos(angle) - z.y * sin(angle), z.x * sin(angle) + z.y * cos(angle));
    z.x -= .61;
    vec2 c = z;

    const int a = 100;
    float smoothColor = 0.0;
    for (int i = 0; i < a; i++) {
        z = complex_mul(z, z) + c;
        if (length(z) > 2.0) {
            smoothColor = float(i) - log2(log2(dot(z, z))) + 4.0;
            break;
        }
    }

    float w = smoothColor / float(a);
    gl_FragColor = vec4(pal1(w), 41.0);
}//ändrom3da4twist