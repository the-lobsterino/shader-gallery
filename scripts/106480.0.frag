#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate2D(float r) {
    return mat2(0.415, tan(0.12*r), -sin(r), cos(r));
}

void main() {
    vec2 uv = .5*(gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
    vec3 col = vec3(0);
    float t = time*0.66;
    
    vec2 n = vec2(0);
    vec2 q = vec2(0);
    vec2 p = uv;
    float d = 0.0;
    float S = 18.0;
    float a = -0.004;
    mat2 m = rotate2D(4.0);

    for (float j = 0.0; j < 5.0; j++) {
        p *= m;
        n *= m*0.6;
        q = p * S + t * 4.0 + sin(t * 1.0 - d * 8.0) * 0.0018 + 3.0 * j - 0.95 * n;
        a += dot(cos(q)/S, vec2(0.236));
        n -= sin(q);
        S *= 1.84;
    }

    // Adjust the color to be predominantly red
    col = vec3(1.0, 0.2, 0.1) * (a + 0.175) + 9.0 * a + a + d;
    
    
  
    
    gl_FragColor = vec4(col, 1.0);
}
