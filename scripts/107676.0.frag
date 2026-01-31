

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define iTime time
#define iMouse vec3(mouse,mouse.y)
#define iResolution resolution
#define iFrame int(time)
#define fragCoord gl_FragCoord.xy
#define fragColor gl_FragColor
#define texture(A,B) vec3(B)
#define mainImage(A,B) main()

float hash(vec3 p) {
    p = fract(p * 0.3183099 + 6.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i + vec3(0, 0, 0)), 
                       hash(i + vec3(1, 0, 0)), f.x),
                   mix(hash(i + vec3(0, 1, 0)), 
                       hash(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(hash(i + vec3(0, 0, 1)), 
                       hash(i + vec3(1, 0, 1)), f.x),
                   mix(hash(i + vec3(0, 1, 1)), 
                       hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}

mat2 rotate(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

float sphere(vec4 s) {
    return length(s.xyz) - s.w;
}

vec4 getGlow(float minPDist) {
    float mainGlow = minPDist * 1.2;
    mainGlow = pow(mainGlow, 32.0);
    mainGlow = clamp(mainGlow, 0.0, 1.0);
    float outerGlow = minPDist * 0.4;
    outerGlow = pow(outerGlow, 2.0);
    outerGlow = clamp(outerGlow, 0.0, 1.0);
    vec4 glow = vec4(10, 5, 3, mainGlow);
    glow += vec4(0, 0, 0, outerGlow);
    glow.a = min(glow.a, 1.0);
    return glow;
}

float getDist(vec3 p) {
    vec3 diskPos = -p;
    float diskDist = sphere(vec4(diskPos, 5.0));
    diskDist = max(diskDist, diskPos.y - 0.01);
    diskDist = max(diskDist, -diskPos.y - 0.01);
    diskDist = max(diskDist, -sphere(vec4(-p, 1.5) * 10.0));
    if(diskDist < 2.0)
    {
        vec3 c = vec3(length(diskPos), diskPos.y, atan(diskPos.z + 1.0, diskPos.x + 1.0) * 0.5);
        c *= 10.0;
        diskDist += noise(c) * 0.4;
        diskDist += noise(c * 2.5) * 0.2;
    }
    return diskDist;
}

vec4 raymarch(vec3 ro, vec3 rd) {
    vec3 p = ro;
    float glow = 0.0;
    for (int i = 0; i < 700; i++) {
        float dS = getDist(p);
        glow = max(glow, 1.0 / (dS + 1.0));
        vec3 bdir = normalize(-p);
        float bdist = length(p);
        dS = min(dS, bdist) * 0.04;
        if(dS > 30.0) break;
        if(bdist < 1.0) {
            vec4 gcol = getGlow(glow);
            vec4 c = vec4(0.0, 0.0, 0.0, 1.0);
            c.rgb = mix(c.rgb, gcol.rgb, gcol.a);
            return c;
        }
        bdist = pow(bdist + 1.0, 2.0);
        bdist = dS * 1.0 / bdist;
        rd = mix(rd, bdir, bdist);
        p += rd * max(dS, 0.01);
    }
    vec4 c = vec4(texture(iChannel0, rd).rgb * 0.2, 1.0);
    vec4 gcol = getGlow(glow);
    c.rgb = mix(c.rgb, gcol.rgb, gcol.a);
    return c;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    vec3 ro = vec3(0, cos(iTime * 0.5) * 10.0, sin(iTime * 0.5) * 10.0);
    vec3 rd = normalize(vec3(uv.x, uv.y, 1));
    rd.yz *= rotate(iTime * 0.5 + 1.57);
    vec4 c = raymarch(ro, rd);
    fragColor = vec4(c.rgb, 1.0);
}