/* 
 * Original shader from: https://www.shadertoy.com/view/ttfczH
 */


#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform sampler2D backbuffer;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //

/*
	people
	stb 2020
	Not golfed... or very tidy for that matter.
*/

#define PI 3.14159265
#define T .7 * iTime

const float Rpt	= 7.;
const float Sm	= .5;

// iq's polynomial smooth min;
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

// conformal function
vec2 spiral(vec2 p, vec2 m) {
    vec2 ri = vec2(log(length(p)), atan(p.y, p.x));
    ri = vec2(ri.y*m.x-ri.x*m.y, ri.y*m.y+ri.x*m.x);
    return ri / PI / 4.;
}

// a clunky, but working line function
float line(in vec2 p, vec2 p0, vec2 p1) {
    vec2 d	= normalize(p1-p0);
    float l	= .5 * length(p1-p0);
    p -= p0;
    if(distance(p0, p1)>0.) {
    	p	= mat2(d.y, d.x, -d.x, d.y) * p;
	    p.y	= max(0., abs(p.y-l)-l);
    }
    return length(p);
}

// repeating humanoid sdf
float map_(in vec2 p) {
    float f;
    vec3 o = vec3(-1., 0., 1.);
    
    // repetition
    p.x = mod(p.x, 2.*Rpt)-Rpt;
    
    // head, body
    f = smin(length(p-1.4*o.yz)-.5, line(p, o.yy, o.yx)-.5, Sm);
    
    // symmetry
    vec2 p2 = vec2(abs(p.x), p.y);
    
    // arms
    f = smin(f, line(p2, vec2(.5, 0.), vec2(2.7, .5))-.1, Sm);
    
    // legs
    f = smin(f, line(p2, vec2(.5, -1.5), vec2(1., -4.))-.1, Sm);
    
    return f;
}

// smin() two repeating sdfs...
float map(in vec2 p) {
    p.x -= 10. * T;
    return max(0., smin(map_(p), map_(p-vec2(Rpt, 0.)), 1.5));
}

// one spiral strip
float map_spiral(in vec2 p, float o, inout vec3 col) {
    p = spiral(p, vec2(12., 4.));
    
    p.y += o;
    p.y = mod(-p.y, 2.) - 1.;
    
    col += .2 + .2 * vec3(sin(T*PI+PI*p.x/3.), cos(T*PI/3.+PI*p.x+1.712), sin(T*PI+PI*p.x/3.+2.2));
    
    return map(2.*Rpt*p);
}

void mainImage( out vec4 fo, in vec2 fc ) {
	vec2 res = iResolution.xy;
	vec2 p = (fc-res/2.) / res.y;
	vec2 uv = fc / res;
	p *= 24.;
    
    vec3 col = vec3(1.);
    
    // smin() two spiral strips
    float m = smin(map_spiral(p, .25*T, col), map_spiral(p, .25*T+1., col), 2.);
    
    // ops
    float f = 1. - pow(m, .7)/4.;
    f += .05 * abs(fract(1./exp(m)*11.+T)-.5) * length(col) - .25;
    f += max(0., 1.-.4*pow(length(p), .5))*(1.+.5*cos(iTime));
    
    // sinal output
	fo = vec4(col*vec3(f), 1.);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}