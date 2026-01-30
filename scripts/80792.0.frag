#ifdef GL_ES
precision mediump float;
#endif

#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .01
#define SMOOTHNESS .75


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float smoothMin(float dstA, float dstB) {
    float h = max(SMOOTHNESS - abs(dstA - dstB), 0.) / SMOOTHNESS;
    return min(dstA, dstB) - h * h * h * SMOOTHNESS * 1. / 6.0;
}

float distBox(vec3 p, vec3 s) {
    return length(max(abs(p) - s, 0.));
}
float getDist(vec3 p) {
    vec4 s = vec4(0, 1, 6, 1);
    vec4 s2 = vec4(0.5, 1, 6, 1);

    s2.x += 3. * sin(u_time);
    s2.z += .8 * cos(u_time);

    float sphereDist = smoothMin(length(p - s.xyz) - s.w, distBox(p - s2.xyz, vec3(s2.w, s2.w, s2.w)));
    float planeDist = p.y;

    float d = smoothMin(sphereDist, planeDist);
    return d;
}

float rayMarch(vec3 ro, vec3 rd) {
    float dO = 0.0;

    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * dO;
        float dS = getDist(p);
        dO += dS;
        if (dO > MAX_DIST || dS < SURF_DIST) break;
    }

    return dO;
}


vec3 getNormal(vec3 p) {
    float d = getDist(p);
    vec2 e = vec2(.01, 0);

    vec3 n = d - vec3(getDist(p - e.xyy), getDist(p - e.yxy), getDist(p - e.yyx));

    return normalize(n);
}

float getLight(vec3 p) {
    vec3 lightPos = vec3(3, 3, 0);

    // lightPos.xz += 2.* vec2(sin(iTime), cos(iTime));
    vec3 l = normalize(lightPos - p);
    vec3 n = getNormal(p);

    float dif = dot(n, l);

    float d = rayMarch(p + n * SURF_DIST * 2., l);

    if (d < length(lightPos - p)) dif *= .1;

    return dif;
}


void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * u_resolution.xy) / u_resolution.y;

    vec3 ro = vec3(0, 1, 0);
    vec3 rd = normalize(vec3(uv.x, uv.y, 1));

    float d = rayMarch(ro, rd);
    vec3 p = ro + rd * d;

    float dif = getLight(p);

    vec3 col = vec3(dif * ((gl_FragCoord) / u_resolution.y).xyx);
    gl_FragColor = vec4(col, 1.0);
}