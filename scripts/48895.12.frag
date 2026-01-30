precision lowp float;
uniform float time;
uniform vec2 mouse, resolution;

#define R2(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)
#define Rmat(a, b) mat3(1, 0, 0, 0, cos(b), -sin(b), 0, sin(b), cos(b)) * mat3(cos(a), 0, sin(a), 0, 1, 0, -sin(a), 0, cos(a))
#define pi acos(-1.)

float map(vec3 p) {
    R2(p.xy, pi + time * 0.1), R2(p.yz, pi + time * .06);

    p = (0.5 * pi) * abs(fract(p * sin(.1)) - .5);

    float u = dot(p.y, cos(p.y) * .4 + .3);
    float v = (sin(p.z) * .5 + .5) / 1.;

    p.xz *= mat2(.5, u, -u, .5);
    p.xy *= mat2(v, 1., -1., v);

    p = (2.0 * pi) * p * p;

    return 0.001 + sqrt(dot(p - vec3(.01), pow(p.yzx, vec3(1., .5, .89))));
}

void main() {
    
    // ----------------------- CAMERA

    vec2 st = 2.0 * gl_FragCoord.xy / resolution.xy - 1.0;
    if (acos(abs(st.y)) < 0.8777 && abs(st.x) > (cos(.1 + fract(dot(st.y, st.y)) + (1.3 + st.x * 2.5)))) { gl_FragColor = vec4(0.1, 0, 0.15, 1.); return; }

    vec3 ro = vec3(0.001, 0.001, -1.0);
    vec3 lookAt = vec3(0);
    vec3 up = vec3(0, 1, 0);
    float fov = 95.;
    vec3 g = normalize(lookAt - ro.xyz);
    vec3 u = normalize(cross(g, up));
    vec3 v = normalize(cross(u, g));
    u = u * tan(radians(fov * 0.5));
    float aspect = (resolution.x / resolution.y);
    v = v * tan(radians(fov * 0.5)) / aspect;
    float v1 = acos(radians(8.) / (sqrt(dot(st, st * .05))));
    vec3 rd = normalize(g + st.x * u + st.y * max(-v, v1 - cos(u)));

    // mouse and basic rotation
    vec2 mo = 2.5 * atan((3.14 * (mouse.xy) - 1.) * vec2(aspect, 1.0));
    mat3 rot = Rmat(mo.x, mo.y);
    rd = rot * rd; ro = rot * ro;


    // ----------------------- RAYMARCH

    vec3 color = vec3(0.0);
    float t = 0.0; float d = 0.0;

    for (float i= 0.; i < 1.0; i += .0083)
    {
        if (d >= 0.001 && t > 100.0) break;
        d = map(t * rd);
        d = max(d, 0.0013);
        t += d;
    }

    // ----------------------- SHADE

    color = vec3(.5) * (t * 0.5) * (t * 0.0012);

    gl_FragColor.rgb = 0.75 - sqrt(vec3(0.1, 0.2, 0.32) * color);
    gl_FragColor.a = 1.0;

}//nabr