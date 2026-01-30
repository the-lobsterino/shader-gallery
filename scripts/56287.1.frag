precision highp float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

vec3 spotLightPos;

float sphere(vec3 p) {
    return length(p) - 1.0;
}

float map(vec3 p) {
    float d = length(p - spotLightPos) - 0.1;
    return min(d, sphere(p));
}

vec3 getNormal(vec3 p) {
    const float d = 0.001;
    return normalize(vec3(
        map(p + vec3(d,0,0)) - map(p - vec3(d,0,0)),
        map(p + vec3(0,d,0)) - map(p - vec3(0,d,0)),
        map(p + vec3(0,0,d)) - map(p - vec3(0,0,d))
        ));
}

void main(void) {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    vec3 cPos = vec3(mouse.x - 0.5, mouse.y - 0.5, 3.0);
    vec3 cDir = vec3(0.0, 0.0, -1.0);
    vec3 cUp  = vec3(0.0, 1.0, 0.0);
    vec3 cSide = cross(cDir, cUp);

    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir);

    spotLightPos = vec3(1.4*cos(time), 0.5*sin(time), 1.0+0.4*abs(cos(time*0.3)));
    vec3 spotLightDir = normalize(-spotLightPos);

    vec3 pos;
    float d, depth = 0.0;
    for (int i = 0; i < 64; i++) {
        pos = cPos + ray * depth;
        d = map(pos);
        depth += d;
        if (abs(d) < 0.001) break;
    }

    vec3 col = vec3(0);
    if (abs(d) < 0.001) {
        vec3 spotLight = spotLightPos - pos;
        float spotLightLength = length(spotLight);
        spotLight = normalize(spotLight);
        const float pi = acos(-1.0);
        const float range = 4.0;
        const float angle = 90.0;
        const float rad = cos(angle / 2.0 * pi / 180.0);
        float attenuation = dot(spotLight, -spotLightDir) > rad ? 1.0 : 0.0;
        attenuation *= mix(1.0, 0.0, spotLightLength/range);
        attenuation *= attenuation;

        vec3 normal = getNormal(pos);
        float diff = clamp(dot(normal, spotLight), 0.0, 1.0);

        col = vec3(diff * attenuation);

        const vec3 lightDir = normalize(vec3(-1,1,1));
        normal = getNormal(pos);
        diff = clamp(dot(normal, lightDir), 0.0, 1.0);
        col += vec3(diff*0.3);
    }
    gl_FragColor = vec4(col, 1.0);
}
