/*
 * Original shader from: https://www.shadertoy.com/view/fscGW7
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
const float SceneDurationSeconds = 5.;
const float Complexity = 14.;

vec4 hash42(vec2 p)
{
	vec4 p4 = fract(vec4(p.xyxy) * vec4(.1031, .1030, .0973, .1099));
    p4 += dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}

mat2 rot2D(float r){
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}

void mainImage(out vec4 o, vec2 C)
{
    vec2 uv = C/iResolution.x+100.;
    uv.y *= .7; // nicer when vertical
    float sd = 1.;
    vec4 c = vec4(1);

    float scene = floor((iTime+100.)/SceneDurationSeconds);
    vec4 hscene = hash42(uv-uv+scene);
    uv.x += scene;
    float t = .03*iTime;

    for (float i = 1.;i<Complexity;++i) {
        vec2 cell = floor(uv);
        vec4 h = hash42(cell+i);
        vec4 h2 = hash42(h.xy);
        vec2 p = cell + .5 + (h.xy-.5);
        vec2 d = min(fract(uv), 1.-fract(uv));
        uv *= 1.+(h.zw*2.);
        uv += t*i*(h2.zw-.5)*vec2(1,.1)*2.;
        uv *= rot2D((h.z-.5)*.1);
        vec2 rotated = h.xy * rot2D(t*5.*h.w);
        h.xy = rotated;
        h = clamp(h,0.,1.);
        sd *= pow(min(d.x,d.y), mix(.14, .22, h2.z));
        c = mix(c,h,min(1.,sd+.15))/min(.78,i*.15);
        c += h2.x*h2.y;
    }

    o = 1.-(c / Complexity);
    o.rgb = mix(o.rgb,vec3(o.r+o.g+o.b)/3.,hscene.z);
    o *= 1.2;
    o = clamp(o,0.,1.);
    vec2 uvn = C/iResolution.xy-.5;
    o *= 1.-dot(uvn,uvn*1.6);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}