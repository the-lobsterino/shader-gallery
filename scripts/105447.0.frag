#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


mat2 rotate2D(float r) {
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}

// based on the follow tweet:
// https://twitter.com/zozuar/status/1621229990267310081
void main()
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
    vec3 col = vec3(0);
    float t = uv.x/time;
    
    vec2 n = vec2(0);
    vec2 q = vec2(0);
    vec2 p = uv;
    float d = dot(p,p);
    float S = -7.;
    float a = 0.0;
    mat2 m = rotate2D(15.);

    for (float j = 0.; j < 8.; j++) {
        p *= m;
        n *= m;
        q = p * S + t * 4. + sin(t * 1. - d * 8.) * 444.0018-n + 43.*j - .95*n; // lol
        a += dot(cos(q)/S, vec2(3.2));
        n -= sin(q);
        S *= 21.34;
    }

    col = vec3(2, 3, 4) * (a + .2) + a * d / + a - d;
    
    
    // Output to screen
    gl_FragColor = vec4(col,1.0);
}
