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
//based on 8x8x1 font data by David Hoskins.
#define _SP loc.x+=1.; 
#define _NL loc.x=0.; loc.y-=1.;
#define _SG col += char(vec4(0x78CC, 0xC07C, 0x06C6, 0x7C00)); col += char(vec4(0x1818, 0x1818, 0x1818, 0x1818)); loc.x+=1.;
#define _SMI col += char(vec4(0x3C7E, 0xDBDB, 0xFFC3, 0x663C)); loc.x+=1.;
#define _B2 col += char(vec4(0x1144, 0x1144, 0x1144, 0x1144)); loc.x+=1.;
#define _B3 col += char(vec4(0x55AA, 0x55AA, 0x55AA, 0x55AA)); loc.x+=1.;
#define _B4 col += char(vec4(0x55, 0x55, 0x55, 0x55)); loc.x+=1.;
#define _B5 col += char(vec4(0x4992, 0x2449, 0x9224, 0x4992)); loc.x+=1.;
#define _TL col += char(vec4(0x103, 0x70F, 0x1F3F, 0x7FFF)); loc.x+=1.;
#define _TR col += char(vec4(0x80C0, 0xE0F0, 0xF8FC, 0xFEFF)); loc.x+=1.;
#define _BL col += char(vec4(0xFF7F, 0x3F1F, 0xF07, 0x301)); loc.x+=1.;
#define _BR col += char(vec4(0xFFFE,0xFCF8,0xF0E0,0xC080)); loc.x+=1.;
// #define _FB col += char(vec4(0xFFFF,0xFFFF,0xFFFF,0xFFFF)); loc.x+=1.;


vec2 loc;
vec2 crd;

float char(in vec4 b)
{
    float bin;
    vec2 p = crd - (loc * 8.0);
    if (!(all(lessThan(p,vec2(8))) &&  all(greaterThanEqual(p,vec2(0))))) return 0.0;
	p = floor(8.0-p);
	int c = int(p.y / 2.0);
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


 
void mainImage( out vec4 fragColor, in vec2 coord )
{

	coord /= 2.;
	crd = vec2(coord.x, coord.y) * .4;
	float col = -0.8;
	
	crd.x = crd.x + (mod(iTime*10.,10.0));
	
	loc = vec2(0, resolution.y/50.);

	//if (mod(iTime,2.0) < 1.0) {
	_SMI _SMI _SMI _SMI _SMI _NL
	_TL _TR _B2 
	
	loc.x+=1.;	
	_B2 _B2 _B3 _B3 _B3 _B4 _B5 _NL
	_BL _BL
			
	loc.x+=1.;
	

	
	_BR
	
	for(int i=0;i<10;++i){
	//col += float(float(i)/100.); loc.x +=1.;
	}
		
	float r = 1.0;
	float g = 1.0;
	float b = 1.0;
	
	fragColor = vec4(col) * vec4(mod(crd.x,8.0), mod(crd.y,8.0), b, 1.);
}

//ep fooling around

