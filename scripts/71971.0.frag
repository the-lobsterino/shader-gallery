/*
 * Original shader from: https://www.shadertoy.com/view/ssX3Wr
 */
// used here: https://www.youtube.com/watch?v=MpwcOnrWffQ

// grid blend?

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox 
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
// Simple Hex, Tri and Square grids (SST)
//
// Feel free to optimize, golf and generally improve them :)
//
// Del - 15/03/2021
vec4 HexGrid(vec2 uv, out vec2 id)
{
    uv *= mat2(1.1547,0.0,-0.5773503,1.0);
    vec2 f = fract(uv);
    float triid = 1.0;
	if((f.x+f.y) > 1.0)
    {
        f = 1.0 - f;
     	triid = -1.0;
    }
    vec2 co = step(f.yx,f) * step(1.0-f.x-f.y,max(f.x,f.y));
    id = floor(uv) + (triid < 0.0 ? 1.0 - co : co);
    co = (f - co) * triid * mat2(0.866026,0.0,0.5,1.0);    
    uv = abs(co);
    return vec4(0.5-max(uv.y,abs(dot(vec2(0.866026,0.5),uv))),length(co),co);
}

// EquilateralTriangle distance
float sdEqTri(in vec2 p)
{
    const float k = 1.7320508;//sqrt(3.0);
    p.x = abs(p.x) - 0.5;
    p.y = p.y + 0.5/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -1.0, 0.0 );
    return -length(p)*sign(p.y);
}

// triangle grid equiv
vec4 TriGrid(vec2 uv, out vec2 id)
{
    const vec2 s = vec2(1, .8660254); // Sqrt (3)/2
    uv /= s;
    float ys = mod(floor(uv.y), 2.)*.5;
    vec4 ipY = vec4(ys, 0, ys + .5, 0);
    vec4 ip4 = floor(uv.xyxy + ipY) - ipY + .5; 
    vec4 p4 = fract(uv.xyxy - ipY) - .5;
    float itri = (abs(p4.x)*2. + p4.y<.5)? 1. : -1.;
    p4 = itri>0.? vec4(p4.xy*s, ip4.xy) : vec4(p4.zw*s, ip4.zw);  

    vec2 ep = p4.xy;
    ep.y = (ep.y + 0.14433766666667*itri) * itri;
    float edge = sdEqTri(ep); // dist to edge
    id = p4.zw;
    id *= mat2(1.1547,0.0,-0.5773503,1.0); // adjust ID (optional)
    p4.y+=0.14433766666667*itri;
    return vec4(abs(edge),length(p4.xy),p4.xy);
}

// simple square grid equiv
vec4 SquareGrid(vec2 uv, out vec2 id)
{
    vec2 fs =  fract(uv)-0.5;
    id = floor(uv);
    id *= mat2(1.1547,0.0,-0.5773503,1.0); // adjust ID (optional)
    vec2 d = abs(fs)-0.5;
    float edge = length(max(d,0.0)) + min(max(d.x,d.y),0.0);
    return vec4(abs(edge),length(fs),fs.xy);
}

float hbar(vec2 p, float nline, float t)
{
    return 0.5+sin((p.y*nline)+t)*0.5;
}

// Demo 3xGrids or Let the user select a grid with mouse...
float SelectGrid(float xx)
{
    float gridtype = 0.5;
    if (xx > 0.66)
     gridtype=2.5;
    else if (xx > 0.33)
     gridtype = 1.5;
    return gridtype;
}

#define	PI 3.14159
#define	TAU 6.28318
// out: 0->val->0
float SmoothTri2(float t, float val)
{
    return val * (1.0-(0.5+cos(t*TAU)*0.5));
}
mat2 rot( float th ){ vec2 a = sin(vec2(1.5707963, 0) + th); return mat2(a, -a.y, a.x); }

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float t = iTime;
	vec2 uv = (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    float xx = ((fragCoord.x-.5*iResolution.x) / iResolution.x)+0.5;

    // dirty grid switching
    vec2 id;
    vec4 h;

    vec2 id2;
    vec4 h2;
	
 //h = SquareGrid(uv*8.0, id2);
	vec2 uv2 = uv;
	//uv *= rot(time*0.1);
 h2 = HexGrid(uv*8.0, id2);
	
	//uv2 *= rot(-time*0.1);
	
	
 h = TriGrid(uv2*8.0, id);
	
	float tt = SmoothTri2(length(uv)*0.5 + fract(time*0.2),3.0)-1.0;
	
	tt = clamp(tt,0.0,1.0);
	
	h = mix(h,h2,tt);
	id = mix(id,id2,tt);
	

    vec3 bordercol = vec3(1.0,1.0,1.0);
    vec3 shapecol = vec3(0.45,0.35,0.15);
    
    // just do a simple patterned shape tint based on cell IDs
    float patternVal = .5; // 4.1
    float cm = 1.0 + pow(sin(length(id)*patternVal + t*0.65), 4.0);	// pulse mult
    cm *= 1.0 + (hbar(h.zw,100.0,t*12.0)*0.1);					// bars mult
    shapecol *= cm;
    
    // Output to screen
    vec3 finalcol = mix(bordercol,shapecol, smoothstep(0.0,0.035,h.x)); // edge
    finalcol = mix(bordercol,finalcol, smoothstep(0.0,0.065,h.y));  // centre
    
    // vignetting
    uv = fragCoord/iResolution.xy;
	finalcol *= 0.5 + 0.5*pow( 16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y), 0.1 );

    //finalcol = vec3(h.zw,0.0); // just show cell uv
    
    // divider lines
    //float div = (1.0-max( step(abs(xx-0.33),0.0025),step(abs(xx-0.66),0.0025)));
    fragColor = vec4(finalcol ,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}