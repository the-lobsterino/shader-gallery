// COVID pass universal QR code   HEIL MEIN PHARMA !
#extension GL_OES_standard_derivatives : enable
#define _SS col += char(vec4(0x9E90, 0x90FE, 0x1212, 0xF200)/2.);loc.x+=1.;
#define _BB col += char(vec4(0xFEFF, 0xFEFF, 0xFEFF, 0xFE00)/2.);loc.x+=1.;

precision mediump float;

uniform vec2 resolution;
float mainImage( in vec2 fragCoord, in vec3 rd);

float hash(vec3 v3, float bias) {
	return floor(bias+fract(sin(dot(v3, vec3(12.3, 45.6, 78.9))) * 987654.321));
}

void main( void ) {
	vec2 uv = floor((gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y) *90.);
	vec3 p = vec3(0.0, 0.0, 10.0);
	vec3 rd = (vec3(uv, -1.));

	vec4 col = vec4(mainImage(gl_FragCoord.xy, rd));
 	gl_FragColor = col;
	gl_FragColor = 1.-gl_FragColor;
}


// BEGIN: shadertoy porting template
// https://gam0022.net/blog/2019/03/04/porting-from-shadertoy-to-glslsandbox/

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
 
float mainImage( in vec2 coord, in vec3 rd )
{
    float col = 0.0;
	
    crd = vec2(coord.x, coord.y+373.) * 0.0245;        
    loc = vec2(0, resolution.y/450.);
	_BB
    col *= hash(rd,.15);    
		
    crd = vec2(coord.x, coord.y+373.) * 0.0245;        
    loc = vec2(0, resolution.y/450.);
	_SS		
    col *= hash(rd,.65);
		
    crd = vec2(coord.x - 40., coord.y) * 0.5; 
    loc = vec2(0, resolution.y/20.5);

	_SS _SP _SP _SP
	
    return col;
}