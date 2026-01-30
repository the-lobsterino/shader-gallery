// BEGIN: shadertoy porting template
// https://gam0022.net/blog/2019/03/04/porting-from-shadertoy-to-glslsandbox/
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;


uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iTime;                 // shader playback time (in seconds)
uniform float     iTimeDelta;            // render time (in seconds)
uniform int       iFrame;                // shader playback frame
uniform float     iChannelTime[4];       // channel playback time (in seconds)
uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
//uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
uniform vec4      iDate;                 // (year, month, day, time in seconds)
uniform float     iSampleRate;           // sound sample rate (i.e., 44100)



#define iResolution resolution
#define iTime time
#define iMouse mouse

void mainImage(out vec4 fragColor, in vec2 fragCoord);

void main(void) {
    vec4 col;
    mainImage(col, gl_FragCoord.xy);
    gl_FragColor = col;
}
// END: shadertoy porting template



// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

//8x8x1 font data by David Hoskins.
#define _A col += char(vec4(0x386C, 0xC6C6, 0xFEC6, 0xC600));loc.x+=1.;
#define _B col += char(vec4(0xFCC6, 0xC6FC, 0xC6C6, 0xFC00));loc.x+=1.;
#define _C col += char(vec4(0x3C66, 0xC0C0, 0xC066, 0x3C00));loc.x+=1.;
#define _D col += char(vec4(0xF8CC, 0xC6C6, 0xC6CC, 0xF800));loc.x+=1.;
#define _E col += char(vec4(0xFEC0, 0xC0FC, 0xC0C0, 0xFE00));loc.x+=1.;
#define _F col += char(vec4(0xFEC0, 0xC0FC, 0xC0C0, 0xC000));loc.x+=1.;
#define _G col += char(vec4(0x3E60, 0xC0CE, 0xC666, 0x3E00));loc.x+=1.;
#define _H col += char(vec4(0xC6C6, 0xC6FE, 0xC6C6, 0xC600));loc.x+=1.;
#define _I col += char(vec4(0x7E18, 0x1818, 0x1818, 0x7E00));loc.x+=1.;
#define _J col += char(vec4(0x606, 0x606, 0x6C6, 0x7C00));loc.x+=1.;
#define _K col += char(vec4(0xC6CC, 0xD8F0, 0xF8DC, 0xCE00));loc.x+=1.;
#define _L col += char(vec4(0x6060, 0x6060, 0x6060, 0x7E00));loc.x+=1.;
#define _M col += char(vec4(0xC6EE, 0xFEFE, 0xD6C6, 0xC600));loc.x+=1.;
#define _N col += char(vec4(0xC6E6, 0xF6FE, 0xDECE, 0xC600));loc.x+=1.;
#define _O col += char(vec4(0x7CC6, 0xC6C6, 0xC6C6, 0x7C00));loc.x+=1.;
#define _P col += char(vec4(0xFCC6, 0xC6C6, 0xFCC0, 0xC000));loc.x+=1.;
#define _Q col += char(vec4(0x7CC6, 0xC6C6, 0xDECC, 0x7A00));loc.x+=1.;
#define _R col += char(vec4(0xFCC6, 0xC6CC, 0xF8DC, 0xCE00));loc.x+=1.;
#define _S col += char(vec4(0x78CC, 0xC07C, 0x6C6, 0x7C00));loc.x+=1.;
#define _T col += char(vec4(0x7E18, 0x1818, 0x1818, 0x1800));loc.x+=1.;
#define _U col += char(vec4(0xC6C6, 0xC6C6, 0xC6C6, 0x7C00));loc.x+=1.;
#define _V col += char(vec4(0xC6C6, 0xC6EE, 0x7C38, 0x1000));loc.x+=1.;
#define _W col += char(vec4(0xC6C6, 0xD6FE, 0xFEEE, 0xC600));loc.x+=1.;
#define _X col += char(vec4(0xC6EE, 0x7C38, 0x7CEE, 0xC600));loc.x+=1.;
#define _Y col += char(vec4(0x6666, 0x663C, 0x1818, 0x1800));loc.x+=1.;
#define _Z col += char(vec4(0xFE0E, 0x1C38, 0x70E0, 0xFE00));loc.x+=1.;
#define _a col += char(vec4(0x0, 0x7C06, 0x7EC6, 0x7E00));loc.x+=1.;
#define _b col += char(vec4(0xC0C0, 0xFCC6, 0xC6C6, 0x7C00));loc.x+=1.;
#define _c col += char(vec4(0x0, 0x7EC0, 0xC0C0, 0x7E00));loc.x+=1.;
#define _d col += char(vec4(0x606, 0x7EC6, 0xC6C6, 0x7E00));loc.x+=1.;
#define _e col += char(vec4(0x0, 0x7CC6, 0xFEC0, 0x7C00));loc.x+=1.;
#define _f col += char(vec4(0xE18, 0x7E18, 0x1818, 0x1800));loc.x+=1.;
#define _g col += char(vec4(0x0, 0x7EC6, 0xC67E, 0x67C));loc.x+=1.;
#define _h col += char(vec4(0xC0C0, 0xFCC6, 0xC6C6, 0xC600));loc.x+=1.;
#define _i col += char(vec4(0x1800, 0x3818, 0x1818, 0x7E00));loc.x+=1.;
#define _j col += char(vec4(0xC00, 0x1C0C, 0xC0C, 0xC78));loc.x+=1.;
#define _k col += char(vec4(0xC0C0, 0xCEFC, 0xF8DC, 0xCE00));loc.x+=1.;
#define _l col += char(vec4(0x3818, 0x1818, 0x1818, 0x7E00));loc.x+=1.;
#define _m col += char(vec4(0x0, 0xFCB6, 0xB6B6, 0xB600));loc.x+=1.;
#define _n col += char(vec4(0x0, 0xFCC6, 0xC6C6, 0xC600));loc.x+=1.;
#define _o col += char(vec4(0x0, 0x7CC6, 0xC6C6, 0x7C00));loc.x+=1.;
#define _p col += char(vec4(0x0, 0xFCC6, 0xC6FC, 0xC0C0));loc.x+=1.;
#define _q col += char(vec4(0x0, 0x7EC6, 0xC67E, 0x606));loc.x+=1.;
#define _r col += char(vec4(0x0, 0x6E70, 0x6060, 0x6000));loc.x+=1.;
#define _s col += char(vec4(0x0, 0x7CC0, 0x7C06, 0xFC00));loc.x+=1.;
#define _t col += char(vec4(0x1818, 0x7E18, 0x1818, 0x1800));loc.x+=1.;
#define _u col += char(vec4(0x0, 0xC6C6, 0xC6C6, 0x7E00));loc.x+=1.;
#define _v col += char(vec4(0x0, 0x6666, 0x663C, 0x1800));loc.x+=1.;
#define _w col += char(vec4(0x0, 0xB6B6, 0xB6B6, 0x7E00));loc.x+=1.;
#define _x col += char(vec4(0x0, 0xC6FE, 0x38FE, 0xC600));loc.x+=1.;
#define _y col += char(vec4(0x0, 0xC6C6, 0xC67E, 0x67C));loc.x+=1.;
#define _z col += char(vec4(0x0, 0xFE1C, 0x3870, 0xFE00));loc.x+=1.;
#define _0 col += char(vec4(0x384C, 0xC6C6, 0xC664, 0x3800));loc.x+=1.;
#define _1 col += char(vec4(0x1838, 0x1818, 0x1818, 0x7E00));loc.x+=1.;
#define _2 col += char(vec4(0x7CC6, 0xE3C, 0x78E0, 0xFE00));loc.x+=1.;
#define _3 col += char(vec4(0x7E0C, 0x183C, 0x6C6, 0x7C00));loc.x+=1.;
#define _4 col += char(vec4(0x1C3C, 0x6CCC, 0xFE0C, 0xC00));loc.x+=1.;
#define _5 col += char(vec4(0xFCC0, 0xFC06, 0x6C6, 0x7C00));loc.x+=1.;
#define _6 col += char(vec4(0x3C60, 0xC0FC, 0xC6C6, 0x7C00));loc.x+=1.;
#define _7 col += char(vec4(0xFEC6, 0xC18, 0x3030, 0x3000));loc.x+=1.;
#define _8 col += char(vec4(0x78C4, 0xE478, 0x9E86, 0x7C00));loc.x+=1.;
#define _9 col += char(vec4(0x7CC6, 0xC67E, 0x60C, 0x7800));loc.x+=1.;
#define _EXC col += char(vec4(0x3838, 0x3830, 0x3000, 0x3000));loc.x+=1.;
#define _QTN col += char(vec4(0x7CFE, 0xC60C, 0x3800, 0x3800));loc.x+=1.;
#define _COM col += char(vec4(0x0, 0x0, 0x30, 0x3060));loc.x+=1.;
#define _APO col += char(vec4(0x3030, 0x3000, 0x0, 0x0));loc.x+=1.;
#define _STP col += char(vec4(0x0, 0x0, 0x30, 0x3000));loc.x+=1.;
#define _SP loc.x+=1.; 
#define _NL loc.x=0.; loc.y-=1.;

 


vec2 loc;
vec2 crd;

float char(in vec4 b)
{
    float bin;
    vec2 p = crd- (loc * 9.0);
    if (!(all(lessThan(p,vec2(8))) &&  all(greaterThanEqual(p,vec2(0))))) return 0.0;
    
	p = floor(8.0-p);    int c = int(p.y / 2.0);
    if (c == 0)
    {
    	bin = b.x;
    }else
    if (c == 1)
    {
    	bin = b.y;
    }else
    if (c == 2)
    {
    	bin = b.z;
    }else
    if (c == 3)
    {
    	bin = b.w;
    }
    if (int(mod(p.y, 2.0)) == 0) p.x += 8.;
	return mod(floor(float(bin) / pow(2.0, p.x)), 2.0);
}

float w(float f, float s) {
    return sin(time*s+f);
}
 
void mainImage( out vec4 fragColor, in vec2 coord )
{
    crd = vec2(coord.x + (w(coord.y/10., 1.)-1.)*2., coord.y) * 0.5;
    
    float col = 0.0;
    
    loc = vec2(0, resolution.y/20.5);

    _N _i _c _e _NL _W _h _a _t _NL   _h _a _p _p _e _n _e _d _NL    _t _o _NL    _g _l _s _l _s _a _n _d _b _o _x _QTN
_NL _NL _W _h _e _r _e _SP _i _s _SP _0 _STP _5 _X _QTN
 
    float cs = 3.;

    float b = 1.0;
    float g = (w(coord.y/20.+coord.x/5., cs)+1.)/2.*0.3 + 0.4;
    float r = 0.3;

    fragColor = vec4(col)*vec4(r, g, b, 1.) + vec4(sin(coord.y + 12.0*time), sin(coord.y * 1.5 + 8.0*time), sin(coord.y * 2.5 + 5.0 * time), 0) * 0.3;
}