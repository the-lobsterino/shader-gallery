/*
 * Original shader from: https://www.shadertoy.com/view/ttcBDj
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

// shadertoy emulation
#define iTime time
#define iResolution resolution
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
/*
    random emotes
    2021 stb
*/

// hash without sine
// https://www.shadertoy.com/view/4djSRW
//#define MOD3 vec3(.1031, .11369, .13787) // int range
#define MOD3 vec3(443.8975, 397.2973, 491.1871) // uv range
vec2 hash22(vec2 p) {
	vec3 p3 = fract(vec3(p.xyx) * MOD3);
    p3 += dot(p3, p3.yzx+19.19);
    return fract(vec2((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y));
}

// circle inversion function
vec2 cInv(vec2 p, vec2 o, float r) {
    return (p-o) * r * r / dot(p-o, p-o) + o;
}

// a line of width w, warped by circle inversion, offset by o
float arc(in vec2 p, float w, in vec2 o) {
    p = cInv(p, vec2(0.), 1.);
    p = cInv(p, vec2(0., o.y), 1.);
    p.y -= o.y;

    return  length(vec2(max(0., abs(p.x-o.x)-w), p.y));
}

float emote(vec2 p, vec2 h, float aa) {
    float f=1., eyes, eyebrows=-.065, mouth, head;
    vec2 o = vec2(0., 1.);
    
    // look variable (where the face is facing)
    vec2 lk = .5 * (h-.5);
    
    // get eyes
    eyes = length(vec2(abs(p.x-lk.x)-.36+.25*pow(lk.x, 2.), p.y-.27-lk.y)) - .15;
    
    // get eyebrows (symmetrical or not)
    if(fract(3.447*h.x) < .5)
        eyebrows += arc(vec2(abs(p.x-lk.x)-.35, p.y-lk.y-.5*fract(1.46*lk.y)-.35), .2, 2.*fract(h*2.31)*h.y*o-.5*o);
    else
        eyebrows +=
            min(
                arc(vec2(p.x-lk.x-.35, p.y-lk.y-.25*fract(2.31*lk.y)-.4), .2, 2.*fract(h*2.31)*h.y*o-.5*o),
                arc(vec2(-p.x+lk.x-.35, p.y-lk.y-.25*fract(-1.81*lk.y)-.4), .2, 2.*fract(-h*1.92)*h.y*o-.5*o)
            );
    
    // get mouth
    mouth = arc(p+vec2(0., .35)-.5*lk, .4*pow(h.x, .5), vec2(.35, 1.)*(fract(2.772*h)-.5)) - .08;
    
    // get head
    head = abs(length(p)-1.) - .075;
    
    // combine everything
    f = min(f, eyes);
    if(fract(4.932*h.x) < .65) // some emotes have eyebrows
        f = min(f, eyebrows);
    f = min(f, mouth);
    f = min(f, head);
    
    // result
    return smoothstep(-aa, aa, f);
}

void mainImage( out vec4 fo, in vec2 fc )
{
    vec2 res = iResolution.xy;
    vec2 p   = surfacePosition; //(fc-res/2.) / res.y;
    vec2 m   = (iMouse.xy-res/2.) / res.y;
    
    float zoom     = iMouse.x>0. ? .0125 + .5 * iMouse.y / res.y : .2;
    float headSize = 1.3;
    float aa       = 2. / zoom / res.y * headSize;
    
    // zoom
    p /= zoom;
    
    // scroll
    p.y -= .5 * iTime;
    
    // one hash22 to rule them all
    vec2 h = hash22(ceil(p)+.371);
    
    // get emote
    float f = emote(headSize*(fract(p)*2.-1.), h, aa);
    
    // set initial color to black/white emote
    vec3 col = vec3(f);
    
    // apply circles of color
    if(length(fract(p)-.5) < .5/headSize) {
        col *= fract(vec3(pow(h.x, .15), pow(fract(1.314*h.y), .15), fract(1.823*h.y)));
        col *= clamp(2.*(.75-length(fract(p)-vec2(.5, .6))), 0., 1.);
    }
    
    // output
    fo = vec4(col, 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}