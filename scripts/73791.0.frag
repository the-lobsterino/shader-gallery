/*
 * Original shader from: https://www.shadertoy.com/view/ftfXWH
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
float N21(vec2 p) {
    return fract(sin(p.x*100.+p.y*6574.)*5647.);
}
vec2 N22(vec2 p)
{
    float x = N21(p);
    float y = N21(p + x);
    return vec2(x, y);
}
vec2 GetPos(vec2 id)
{
    vec2 n = N22(id) * (iTime + 100.0) * 0.6;
    return sin(n) * .4;
}

//from bigwings' tutorial
float SmoothNoise(vec2 uv) {
    vec2 lv = fract(uv);
    vec2 id = floor(uv);
    
    lv = lv*lv*(3.-2.*lv);
    
    float bl = N21(id);
    float br = N21(id+vec2(1,0));
    float b = mix(bl, br, lv.x);
    
    float tl = N21(id+vec2(0,1));
    float tr = N21(id+vec2(1,1));
    float t = mix(tl, tr, lv.x);
    
    return mix(b, t, lv.y);
}

float SmoothNoise2(vec2 uv) {
    float c = SmoothNoise(uv*4.);

    c += SmoothNoise(uv*8.2)*.5;
    c += SmoothNoise(uv*16.7)*.25;
    c += SmoothNoise(uv*32.4)*.125;
    c += SmoothNoise(uv*64.5)*.0625;
    
    c /= 2.;
    
    return c;
}
float Shines(vec2 uv)
{
    uv *= 1.5;
    vec2 gv = fract(uv) - 0.5;
    vec2 id = floor(uv);
    vec2 p = GetPos(id);
    float d = length(gv - p);
    float m = smoothstep(0.08, 0.01, d);
    return m;
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    float shine = 0.;
    for(int i = 0; i < 4; i ++)
    {
        shine += Shines(uv * 2.0 * float(i) + float(i));
    }
    uv *= dot(uv, vec2(0.9, 2.4));
    vec2 polarUV = vec2(atan(uv.x, uv.y), length(uv));
    float polarLenght = length(polarUV);
    float noise = SmoothNoise2(polarUV);
    noise *= 1. - length(uv);
    noise += abs(sin(noise * iTime)) * noise;

    vec3 col = (noise + shine * noise) * vec3(abs(sin(iTime * .25)), 0.4 * abs(sin(iTime/5.00)), 0.7 * abs(sin(iTime*1.25)));
    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}