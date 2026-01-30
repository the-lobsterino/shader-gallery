#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;


float specular(vec3 l, vec3 n, float amount) {
    return pow(dot(l, n), 1.0/amount);
}


float direct_light(vec3 n, vec3 direction, float intensity, float spec) {
    vec3 l = normalize(direction)*intensity;
    return max(0.0, dot(l, n) + specular(l, n, spec));
}

mat2 r_matrix(float r) {
    return mat2(cos(r), -sin(r), sin(r), cos(r));
}


float wave(vec2 p) {
    return (
        smoothstep(sin(time) - 0.1, 1.0, length(p)-1.95 + cos(time))
    );
}


vec2 P(float fov, float zoom) {
    vec2 uv = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);
    vec2 p = normalize(vec3(uv.xy, fov)).xy / zoom;
    p *= r_matrix(time*0.25);
    return p;
}



vec3 N(float v, vec2 p, float fuzz) {
    return normalize(vec3(
        v - wave(vec2(p.x + fuzz, p.y)),
        v - wave(vec2(p.x, p.y+fuzz)),
        -fuzz
    ));
}

void main(void) {

    vec2 p = P(1.57, 0.1);

    float v = wave(p);

    vec3 n = N(v, p, 0.13);
    
    //vec3 col = vec3(p, 0.0);
    //vec3 col = vec3(0.5, 0.1, 0.1);
    // Generate colour
    vec3 col = mix(
        vec3(.5, .1, .5),
        vec3(.2, .1, .2),
        n
    );
    
    col.rgb += direct_light(n, vec3(0.0, .4, -0.1), 0.6, 0.7) * .9;

    gl_FragColor=vec4(col,1.0);
}
