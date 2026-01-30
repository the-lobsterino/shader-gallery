/*
 * Original shader from: https://www.shadertoy.com/view/wsKXzG
 */

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// Emulate a black texture
#define textureGrad(sampler, coord, dPdx, dPdy) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
// Author: bitless
// Title: How to hang Mondrian's painting right way?
// Thanks to Patricio Gonzalez Vivo & Jen Lowe for "The Book of Shaders"
// and Fabrice Neyret (FabriceNeyret2) for https://shadertoyunofficial.wordpress.com/
// and Inigo Quilez (iq) for  http://www.iquilezles.org/www/index.htm and Graphtoy
// and whole Shadertoy community for inspiration.


////////////////////////////////////////////////////////////////////////////
//https://www.shadertoy.com/view/llySRh
//find many other tricks here: https://shadertoyunofficial.wordpress.com/


int char_id = -1; vec2 char_pos, dfdx, dfdy; 
vec4 char(vec2 p, int c) {
    vec2 dFdx = dFdx(p/16.), dFdy = dFdy(p/16.);
  if ( p.x>.25&& p.x<.75 && p.y>-0.12&& p.y<1. )  // normal char box
 //   if ( p.x>.25&& p.x<.75 && p.y>.1&& p.y<.85 ) // thighly y-clamped to allow dense text
        char_id = c, char_pos = p, dfdx = dFdx, dfdy = dFdy;
    return vec4(0);
}
vec4 draw_char() {
    int c = char_id; vec2 p = char_pos;
    return c < 0 
        ? vec4(0,0,0,1e5)
        : textureGrad( iChannel0, p/16. + fract( vec2(c, 15-c/16) / 16. ), 
                       dfdx, dfdy );
}

// --- chars
int CAPS=0;
#define low CAPS=32;
#define caps CAPS=0;
#define spc  U.x-=.5;
#define C(c) spc O+= char(U,64+CAPS+c);
////////////////////////////////////////////////////////////////////////////



#define PI 3.1415926
#define FALL_ST 1.5
#define FALL_TIME 1.5

// rotation matrix 
// a - angle
#define rot(a)      mat2( cos(a), -sin(a), sin(a), cos(a) )


// box function
// p - current point
// lb - left/bottom point
// rt - right/top point
// w - border smoothness
float box(vec2 p, vec2 lb, vec2 rt, float w) {
    vec2 r = smoothstep(vec2(w), vec2(0.), abs(p*2.-(rt+lb))-(rt-lb));
    return r.x*r.y;
}

// line function
// p - current point
// x - line center
// t - line thickness
// w - smoothness
float line(float p, float x, float t, float w) {
    float r = smoothstep(0., w, abs(p-x)-t/2.);
    return r;
}

// dumping turn
// t - current time
// k - coof
float sinc(float t, float k )
{
    return sin(t*k-PI/2.)*exp(-t/.75)+1.;
}

// rebound movement
// t - current time
// st_t - start time
// l - movement duration
float move (float t, float st_t, float l) {
    return step(abs(t-st_t-l/2.), l/2.)*abs(cos((t-st_t)*5.)*(l+st_t-t)/FALL_TIME);
}

// box distance field
float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d, vec2(0.))) + min(max(d.x, d.y), 0.);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 g = fragCoord.xy;
    vec2 r = iResolution.xy;
    vec2 st = (g+g-r)/min(r.x, r.y);
    
    float sm = 2.5/min(r.x, r.y); //smoothness

    vec2 U;
    vec2 ch;
    vec4 O = vec4(0.);

    float lc = mod(iTime, 20.); // local time cycle
    
    // subtitles ////////////////////////////
    if (lc < 1.5) {U = ( st - vec2(-1.1,-1.) ) * 5.;  caps C(15) low C(11)C(1)C(25)C(-52)C(31) C(14)C(15)C(23)C(31) C(9)C(20)C(0)C(19)C(31) C(7)C(15)C(15)C(4);}     // "Okay, now it's good"
    else if (lc>2.5 && lc < 4.5) {U = ( st - vec2(-.35,-1.) ) * 5.;  caps C(14) low C(15)C(16)C(5)C(-50);}     // "Nope."
    else if (lc>7.5 && lc < 10.5) { U = ( st - vec2(-0.65,-1.) ) * 5.;  caps C(14) low C(15)C(20)C(31) C(1)C(7)C(1)C(9)C(14)C(-63)}   // "Note again!"
    else if (lc>12.5 && lc < 14.5) {U = ( st - vec2(-0.65,-1.) ) * 5.;  caps C(4) low C(1)C(13)C(13)C(5)C(4) C(31)C(9)C(20)C(-63)}   // "Dammed it!"
    else if (lc>17.5 && lc < 19.5) {    U = ( st - vec2(-0.65,-1.) ) * 5.;  caps C(23) low C(8)C(1)C(20)C(31) C(1)C(31) C(-50)C(-50)C(-50)}   // "What a ..."
    ch = draw_char().xw;
    /////////////////////////////////////

    vec3 color = mix(vec3(.631, .647, .675), vec3(.965, .969, .851), clamp(st.y, -.5, .5)); //background
    color = mix(color, vec3(1.), smoothstep(2., 0., length(st-vec2(-.75, .25)))*.5); //background lighting
    
    // Scale
    st *= .7;

    float a = -PI/2.*(floor((lc-5.)/5.)+sinc(mod(lc, 5.)*1.5, 1.)); //rotation angle

    st.y -= .05;
    st *= rot(a);
    st += .5;
    
    float d1, d2, d3, c;
    
    d1 = -.629*(step(lc, FALL_ST)+move(lc, FALL_ST, FALL_TIME)+(1.-move(lc, 10.+FALL_ST, FALL_TIME))*step(10.+FALL_ST, lc));
    d2 = -.557*(step(lc, FALL_ST)+move(lc, FALL_ST, FALL_TIME)+(1.-move(lc, 10.+FALL_ST, FALL_TIME))*step(10.+FALL_ST, lc))-.072;
    d3 = -.448*(step(lc, 5.+FALL_ST)+move(lc, 5.+FALL_ST, FALL_TIME)+(1.-move(lc, 15.+FALL_ST, FALL_TIME))*step(15.+FALL_ST, lc))-.270;

    c = sdBox(vec2(.5)+vec2(.03, -.03)*rot(a)-st, vec2(.899, 1.)*.5); //painting shadow
    color = mix(color, vec3(0.), smoothstep(.1, 0., c)*.4);

    c = box (st, vec2(.023, -.044), vec2(.976, 1.044), sm); //outer border
    color =  mix(color, vec3(.0), c);

    c = box (st, vec2(.027, -.04), vec2(.973, 1.04), sm); //painting border
    color =  mix(color, vec3(.447, .439, .482), c);

    color = mix(color, vec3(.988, .980, .922), box(st, vec2(.067, 0.), vec2(.933, 1.), sm)); //painting background
    color = mix(color, vec3(.659, .016, .004), box(st+vec2(0., d1), vec2(.067, 0.), vec2(.265, .372), sm)); //red rectangle
    color = mix(color, vec3(.890, .784, .161), box(st+vec2(0., d2), vec2(.903, 0.), vec2(.933, .372), sm)); //yellow rectangle
    color = mix(color, vec3(.063, .302, .588), box(st+vec2(d3, 0.), vec2(0.), vec2(.216, .058), sm)); //blue rectangle
    
	// black stripes    
    c = line(st.x, .261, .028, sm);
    c *= line(st.x, .716, .028, sm);
    c *= line(st.x, .903, .028, sm);
    c *= line(st.y, .631, .028, sm);
    c *= line(st.y, .826, .028, sm);
    c *= 1.-box(st, vec2(.11, .632), vec2(.146, 1.01), sm);
    c *= 1.-box(st, vec2(.257, .055), vec2(.935, .083), sm);
    c = (1.-c) * box (st, vec2(.065, -.002), vec2(.936, 1.002), sm);
    color = mix (color, vec3(0.), c );

    c = box (st, vec2(.064, -.003), vec2(.937, 1.003), sm)-box (st, vec2(.067, .0), vec2(.934, 1.), sm); //inner border
    color =  mix(color, vec3(0.0), c);
    
    color = mix(color, vec3(1.0), ch.x); //subtitles
    color = mix(color, vec3(0.0), smoothstep ( sm*2., 0., abs(0.51-ch.y)-0.01)*0.55); //subtitles border

    fragColor = vec4(color, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}