/*
 * Original shader from: https://www.shadertoy.com/view/mllXz8
 */

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision highp float;
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
    
    Year of Truchets #003
    01/21/2023  @byt3_m3chanic
    
    All year long I'm going to just focus on truchet tiles and the likes!
    Truchet Core \M/->.<-\M/ 2023 
    
*/


#define R           iResolution
#define T           iTime
#define M           iMouse

#define PI         3.14159265359
#define PI2        6.28318530718

float time;
const float scale = 1.;
const vec3 d = vec3(0.957,0.439,0.043);

mat2 rot (float a) { return mat2(cos(a),sin(a),-sin(a),cos(a)); }
float hash21(vec2 a) { return fract(sin(dot(a, vec2(27.609, 57.583)))*43758.5453); }
vec3 hue(float t){ return .42 + .425*cos(PI2*t*(vec3(.95,.97,.98)*d)); }

void mainImage( out vec4 O, in vec2 F )
{
    vec3 C = vec3(0);
    vec2 uv = (2.*F.xy-R.xy)/max(R.x,R.y);
    vec2 vuv = uv, dv = uv;
    
    uv *= rot(T*.025);
    uv = vec2(log(length(uv)), atan(uv.y, uv.x))*3.5;
    uv.x -= T*.25;

    dv = vec2(log(length(dv)), atan(dv.y, dv.x))*3.5;
    dv.x += T*.075;
    
    float px = fwidth(uv.x);

    vec2 id = floor(uv*scale);
    float chk = mod(id.y+id.x,2.)*2.-1.;

    float rnd = hash21(id);
    if(rnd>.5) uv.x*=-1.;

    vec2 qv = fract(uv*scale)-.5;

    float circle = min(length(qv-vec2(-.5,.5))-.5,length(qv-vec2(.5,-.5))-.5);
    float circle3 = abs(circle)-.05;
    
    float c2 = smoothstep(-px,px,abs(abs(circle)-.125)-.025);
    circle = (rnd>.5^^chk>.5) ? smoothstep(px,-px,circle) : smoothstep(-px,px,circle);
    circle3 = smoothstep(.125,-px,circle3);
    
    dv=fract(dv*scale)-.5;
    float dots = min(length(abs(dv)-vec2(0,.5))-.25,length(abs(dv)-vec2(.5,0))-.5);

    dots = abs(abs(abs(abs(dots)-.1)-.05)-.025)-.0125;
    dots = smoothstep(px,-px,dots);
    
    float hs = hash21(vuv)*.25;
    C = clamp(hue(52.+id.x*.15)+hs,C,vec3(1));
    
    C = mix(C,C*.75,dots);
    C = mix(C,C*.75,circle3);
    C = mix(C,vec3(.001),clamp(min(circle,c2),0.,1.));
 
    // Output to screen
    C = pow(C,vec3(.4545));
    O = vec4(C,1.);
}
// --------[ Original ShaderToy ends here ]---------- //

#undef time

void main(void)
{
    iTime = time;
    mainImage(gl_FragColor, gl_FragCoord.xy);
}