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
    vec2 coords = gl_FragCoord.xy - resolution * 1.;
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (coords-.5*resolution.xy)/resolution.y * 4.;
    float t = time;
    
    vec2 n = vec2(0);
    vec2 q = vec2(0);
    vec2 pos = uv;
    float d = 0.7;
    float Size = 4.;
    float a = 0.0;
    mat2 rotate = rotate2D(1.);

    for (float j = 0.; j < 20.; j++) {
        pos *= rotate;
        //n *= rotate;
        q = pos * Size + t * 1. + n; // wtf???
        a += dot(sin(q)/Size, vec2(.3));
        n -= cos(q);
        Size *= 1.2;
    }

    vec3 col = vec3(5, 3, 1) * (a + .2) + a + a - d;
    
    
    // Output to screen
    gl_FragColor = vec4(vec3(a,0.,0), 1.0);
}