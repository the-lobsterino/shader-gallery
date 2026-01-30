/*
 * Original shader from: https://www.shadertoy.com/view/WlVSRW
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define rotate(angle) mat2(cos(angle), sin(angle), sin(-angle), cos(angle))

float sdSphere(vec3 p, float r)
{
    return length(p) - r;
}

float mat = 0.0;
float glow = 0.0;
float map(vec3 p, bool shadow)
{
    p.yz *= rotate(iTime);
    p.xz *= rotate(iTime);
    float d = abs(sdSphere(p, 1.0)) - 0.01;
    vec3 rp = p;
    for(int i = 0; i < 4; ++i)
        rp = abs(rp) - 0.2;

    float d1 = sdSphere(rp + vec3(0.0, 0.0, 0.0), 0.15);
    d = max(d, -d1);
    d = min(d, abs(sdSphere(p, 4.0) - 0.1));
    if(shadow){
       return d;
    }
    float d2 = sdSphere(p, 0.1);
    glow += 0.01 / (0.01 + d2 * d2);
    if(d < d2)
    {
        mat = 0.0;
        return d;
    } 
    else{
        mat = 1.0;
        return d2;
    }
}

float shadow(vec3 r0, vec3 rd, float maxDist)
{
    float d = 0.05;
    float shadow = 1.0;
    for (int i = 0; i < 100; i++)
    {
        if (d >= maxDist)
            break;
        float t = map(r0 + d * rd, true);
        if(t < 0.01) return 0.0;
        d += t;
        shadow = min(shadow, 30.0 * (t / d));
    }
    return shadow;
}

vec3 norm(vec3 p)
{
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
        map(p + e.xyy, false) - map(p - e.xyy, false),
        map(p + e.yxy, false) - map(p - e.yxy, false),
        map(p + e.yyx, false) - map(p - e.yyx, false)
    ));
}

float rand(vec2 uv)
{
    return fract(sin(dot(uv, vec2(13.549, 55.392))) * 312.93);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    vec3 r0 = vec3(0.0, 2.4, -3.0);
    vec3 tgt = vec3(0.0);
    vec3 ww = normalize(tgt - r0);
    vec3 uu = normalize(cross(vec3(0,1,0), ww));
    vec3 vv = normalize(cross(ww, uu));
    vec3 rd = normalize(uv.x * uu + uv.y * vv + 0.95 * ww);
    
    vec3 col = vec3(0.0);
    float d = 0.0;
    vec3 p = vec3(0.0);
    vec3 lp = normalize(vec3(0.0));
    float matId = 0.0;
    for(int i = 0; i < 100; ++i)
    {
        p = r0 + d * rd;
        float t = map(p, false);
        d += t;
        if(abs(t) < 0.001){
            vec3 albedo = vec3(1.0);
            if(matId < 0.5) albedo = vec3(1.0, 0.0, 0.2);
            vec3 n = norm(p);
            vec3 ld = normalize(lp - p);
            vec3 diff = max(dot(n, ld), 0.0) * vec3(0.4, 0.2, 0.8);
            float shad = shadow(p, ld, 8.0);
            col += diff * shad;
            col *= albedo;
            break;
        }
        if(d > 100.0)
        {
            break;
        }
    }

    const int numIter = 100;
    vec3 vD = rd;
    vD = normalize(vD);
    float stepSize = length(p - r0) / float(numIter);
    //vec3 vO = r0 + stepSize * vD * rand(uv) * 0.8;
    vec3 vO = r0 + stepSize * vD;
    float accum = 0.0;
    for(int i = 0; i  < numIter; ++i)
    {
        vec3 ld = normalize(lp - vO);
        float shad = shadow(vO, ld, 4.0);
        float d = dot(vO, vO);
        accum += (0.01 / d ) * shad;
        vO += stepSize * vD;
    }
    col += glow * vec3(0.4, 0.2, 0.8);
    col += accum * vec3(0.4, 0.2, 0.8) * 16.0;
    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}