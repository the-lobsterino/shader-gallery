#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec2 channel0;
#define iTime time
#define iResolution resolution

#define texture(s, uv) vec4(0.0)

#define F float
#define V vec2
#define W vec3
#define N normalize
#define L length
#define rot(x) mat2(cos(x),-sin(x),sin(x),cos(x))
#define S(x) sin(x+2.*sin(x))
#define col(x) (cos((x+W(0,.3,.4))*6.28)*.5+.5)

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    // Synergy shader by @kishimisu
    vec2 g = iResolution.xy;
    vec2 o = (fragCoord + fragCoord - g) / g.y / 0.5;
    float f = iTime * 0.05 - 2.0;
    vec4 O = vec4(0.0);
    
    O.xyz = vec3(0.2, 0.05, 0.15);
    for (float l = 0.0; l < 55.0; l++) {
        float group = mod(l, 10.0) / 10.0;
        float transition = fract(-iTime * 0.2 + group);
        float depth = pow(transition, 0.5);
        vec2 offset = vec2(cos(l * f * 0.2), sin(l + f));
        float fade = smoothstep(0.5, 0.3, abs(0.5 - transition));
        vec2 p = o * (mod(l, 5.0) + 1.0) * depth + offset;
        float s = 0.08 + (1.0 - transition) * 0.4 * step(1.0, 1.0 / abs(mod(l, 40.0)));
        float a = mod(atan(p.y, p.x) + iTime * (step(20.0, l) - 0.5), 3.14);
        float d = length(p) + 0.005 * sin(10.0 * a + iTime + l);
        O += clamp(fade * pow(0.005, 1.0 - 0.2 * (sin(iTime + l) * 0.5 + 0.5)) * transition / abs(d - s) * (cos(l + length(o) * 3.0 + vec4(0, 1, 2, 0)) + 1.0), 0.0, 1.0);
    }
    
    // Custom fractal shader
    F i = 0.0, d = 0.0, e = 1.0;
    W p, pI, rd = N(W(0, 0, 1));
    rd.zy *= rot(uv.y * 2.0);
    rd.xz *= rot(-uv.x * 2.5 + S(iTime * 0.1) * 4.0 + 0.03 * S(iTime + uv.x * 2.0));
    F c;
    for (F ii = 1.0; ii <= 99.0; ii++) {
        if (e <= 0.0001)
            break;
        pI = p = d * rd;
        F sz = 0.25 * texture(channel0, vec2(0.1, 0.75)).x;
        sz = max(sz, 0.1);
        p.z += (iTime * 0.5) + texture(channel0, vec2(0.1, 0.75)).x * 0.01;
        p.zy = p.yz;
        F s, ss = 1.5;
        p.xz *= s = 1.0 + 0.5 * S(pI.y * 2.0 - iTime);
        ss *= s;

        c = 0.0;
        for (F j = 1.0; j <= 4.0; j++) {
            p.xz *= rot(iTime + S(iTime * 0.4 * 1.61 + pI.z * 1.0 + j));
            ss *= s = 3.0;
            p *= s;
            p.y += 0.5 + j / 10.0;
            p.y = fract(p.y) - 0.5;
            p = abs(p) - 0.5 - texture(channel0, vec2(0.1, 0.75)).x * 0.1 + 0.2 * S(pI.z * 0.1 + iTime * 0.1);
            if (p.z < p.x)
                p.xz = p.zx;
            if (p.y > p.x)
                p.xy = p.yx;
            c += L(p) * 0.01;
        }

        p -= clamp(p, -sz, sz);
        d += e = (L(p.xz) - 0.0001) / ss;
        i++;
    }

    vec3 color = 20.0 / i * col(log(d) * 0.8 + c * 20.0 + iTime * 1.0);
    fragColor = vec4(O.rgb + color, 1.0);
}

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.0;
}
