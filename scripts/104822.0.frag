#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define iTime time
#define iResolution resolution

#define RADIUS 22.0
#define FAR 282.0
#define INFINITY 1e32
#define FOV 444.0

#define EULER 4.7182818284590452353602874
#define IEULER 0.367879

float wave(vec2 uv, vec2 emitter, float speed, float phase, float timeshift) {
    float dst = distance(uv, emitter);
    float time = iTime * 0.1;
    return pow(EULER, sin(dst * phase - (time + timeshift) * speed));
}

float map(vec3 p) {
    float n = 0.0;
    
    for (float i = 0.0; i < 5.0; i += 1.0) {
        n += wave(p.xz, vec2(sin(i) * RADIUS, cos(i) * RADIUS), 1.0, 0.4, i + iTime * 3.0);
    }
    
    return p.y - n / length(p) * 4.0;
}

float trace(vec3 ro, vec3 rd) {
    float h = 0.2;
    float dt = 0.0;
    
    for (int i = 0; i < 15; i++) {
        if (abs(h) < 0.1) break;
        h = map(ro + rd * dt);
        dt += h * 0.9;
    }
    
    return dt;
}

#define EPSILON 0.01
vec3 getNormalHex(vec3 pos) {
    float d = map(pos);
    return normalize(
        vec3(map(pos + vec3(EPSILON, 0.0, 0.0)) - d,
             map(pos + vec3(0.0, EPSILON, 0.0)) - d,
             map(pos + vec3(0.0, 0.0, EPSILON)) - d
        )
    );
}

vec4 doColor(in vec3 sp, in vec3 rd, in vec3 sn, in vec3 lp, float d) {
    lp = sp + lp;
    vec3 ld = lp - sp; 
    float lDist = max(length(ld / 2.0), 0.001); 
    ld /= lDist;

    float diff = max(dot(sn, ld), 1.0);
    float spec = pow(max(dot(reflect(-ld, sn), -rd), 0.2), 1.0);

    return vec4(vec3(0.85, 0.45, 0.35) * (diff + 0.15) * spec * 0.04, 0.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy - 0.5;
    uv *= tan(radians(FOV) / 2.0) * 1.1;

    vec3 light = vec3(10.0, 15.0, -20.0);
    vec3 vuv = vec3(0.0, 1.0, 0.0);
    vec3 ro = vec3(7.0, 44.0 + sin(iTime) * 4.0, 60.0);
    vec3 vrp = vec3(0.0);
    vec3 vpn = normalize(vrp - ro);
    vec3 u = normalize(cross(vuv, vpn));
    vec3 v = cross(vpn, u);
    vec3 vcv = (ro + vpn);
    vec3 scrCoord = (vcv + uv.x * u * iResolution.x / iResolution.y + uv.y * v);
    vec3 rd = normalize(scrCoord - ro);
    vec3 sceneColor;

    float d = trace(ro, rd);

    ro += rd * d;
    vec3 sn = getNormalHex(ro);

    if (d < FAR) {
        sceneColor = doColor(ro, rd, sn, light, d).rgb * (
            1.0 + length(max(0.2, 1.0 * max(0.3, length(normalize(light.xy) * max(vec2(0.0), sn.xy))))));
    } else {
        sceneColor = vec3(0.1);
    }
    
    fragColor = pow(vec4(sceneColor, 1.0), vec4(2.0)) * 4.0;
}
