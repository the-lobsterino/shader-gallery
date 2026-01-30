/*
 * Original shader from: https://www.shadertoy.com/view/ss3Szr
 */

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
float iTime = 0.;
#define iResolution resolution

// Protect glslsandbox uniform names
#define time        stemu_time

// --------[ Original ShaderToy begins here ]---------- //
/**
    License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
    
    What can you do in one hour? This is about as far as I can get
    Was just playing with tiles / shifting sections based on id's
    
    @byt3_m3chanic 1 Hour Practice #001 / slide tiles
*/

#define R           iResolution
#define T           iTime
#define M           iMouse

#define PI          3.14159265359
#define TAU         6.28318530718

float time;
const float scale = 7.;
const vec3 d = vec3(0.957,0.439,0.043);

float hash21(vec2 a) { return fract(sin(dot(a, vec2(27.609, 57.583)))*43758.5453); }
float lsp(float begin, float end, float t) { return clamp((t - begin) / (end - begin), 0.0, 1.0); }
float eoc(float t) { return (t = t - 1.0) * t * t + 1.0; }

vec3 hue(float t){ return .55 + .45*cos(TAU*t*(vec3(.95,.97,.98)*d)); }

void mainImage( out vec4 O, in vec2 F )
{
    time = T;
    float tmod = mod(time, 10.);

    vec2 uv = (2.*F.xy-R.xy)/max(R.x,R.y);
    uv.x +=.075;
    vec2 vuv = uv;
    float px = fwidth(vuv.x*TAU);
    uv.y += T*.1;
    vec3 C = vec3(0);

    vec2 id = floor(uv*scale);
    vec2 dd = (id*.2);
    float sw;

    id += vec2(0,5);
    id.x = abs(id.x);
    float yid = floor(mod(id.x,8.));
    //movement
    float t3 = lsp(yid, yid+2.75, tmod);
    t3 = eoc(t3);
    t3 = t3*t3*t3;
    float ga1 = (time*.1);
    sw = (t3*.5);
    uv.y+=sw+(floor(ga1)*.5);
    
    //rest id to new pos
    id = floor(uv*scale);
    //do truchet stuff
    float rnd = hash21(id);
    float chk = mod(id.y + id.x,2.) * 2. - 1.;
    if(rnd>.5) uv.x*=-1.;
    
    vec2 qv = fract(uv*scale)-.5;

    float circle = length(qv-vec2(.5,-.5))-.5;
          circle = min(length(qv-vec2(-.5,.5))-.5,circle);
    float circle3 = abs(circle)-.05;
    
    float c2 = smoothstep(-px,px,abs(abs(circle)-.05)-.025);
    circle = (rnd>.5^^chk>.5) ? smoothstep(px,-px,circle) : smoothstep(-px,px,circle);

    circle3 = smoothstep(.125,-px,circle3);
    float dots = length(abs(qv)-vec2(.5,0))-.25;
    dots = min(length(abs(qv)-vec2(0,.5))-.25,dots);

    dots = abs(abs(abs(dots)-.05)-.025)-.0125;
    dots = smoothstep(px,-px,dots);
    
    float hs = hash21(vuv)*.15;
    C =  clamp(hue(52.+id.x*.05)+hs,C,vec3(1));
    
    C = mix(C,C*.75,dots);
    C = mix(C,C*.75,circle3);
    C = mix(C,C*.70,clamp(max(circle,-c2),0.,1.));
    C = mix(C,vec3(.93),clamp(min(circle,c2),0.,1.));
 
    // Output to screen
    O = vec4(C,1.);
}
// --------[ Original ShaderToy ends here ]---------- //

#undef time

void main(void)
{
    iTime = time;
    mainImage(gl_FragColor, gl_FragCoord.xy);
}