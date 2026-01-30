// original shadertoy - GridBlend3 - https://www.shadertoy.com/view/7ssGRj

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox 
uniform float time;
uniform vec2 resolution;

#extension GL_OES_standard_derivatives : enable

// shadertoy emulation
#define iTime time
#define iResolution resolution

mat2 testinverse(mat2 m)
{
  return mat2(m[1][1],-m[0][1],
             -m[1][0], m[0][0]) / (m[0][0]*m[1][1] - m[0][1]*m[1][0]);
}
// more grid blending! (hex + tri grid)

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
    id*=testinverse(mat2(1.1547,0.0,-0.5773503,1.0)); // optional unskew IDs
    return vec4(0.5-max(uv.y,abs(dot(vec2(0.866026,0.5),uv))),length(co),co);
}

// Triangle grid using the skewed, split rectangle method (quicker)
// this version based on fabrices excellent hexagonal tiling tutorial (I wish I'd found this earlier!!)
// https://www.shadertoy.com/view/4dKXR3
vec4 TriGrid(vec2 uv, out vec2 id)
{
    float scaler = 0.866026;
    uv *= mat2(1,-1./1.73, 0,2./1.73)*scaler;
    vec3 g = vec3(uv,1.-uv.x-uv.y);
    vec3 _id = floor(g)+0.5;
    g = fract(g);
    float lg = length(g);
    if (lg>1.)
        g = 1.-g;
    vec3 g2 = abs(2.*fract(g)-1.);                  // distance to borders
    vec2 triuv = (g.xy-ceil(1.-g.z)/3.) * mat2(1,.5, 0,1.73/2.);
    float edge = max(max(g2.x,g2.y),g2.z);
    id = _id.xy;
    id*= mat2(1,.5, 0,1.73/2.); // Optional, unskew IDs
    id.xy += sign(lg-1.)*0.1; // Optional tastefully adjust ID's
    return vec4(((1.0-edge)*0.43)/scaler,length(triuv),triuv);
}

float hbar(vec2 p, float nline, float t)
{
    return 0.5+sin((p.y*nline)+t)*0.5;
}

float smin( float a, float b, float k )
{
	float h = clamp( 0.5 + 0.5*(b-a)/k, 0.0, 1.0 );
	return mix( b, a, h ) - k*h*(1.0-h);
}

mat2 rot( float th ){ vec2 a = sin(vec2(1.5707963, 0) + th); return mat2(a, -a.y, a.x); }

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float t = iTime;
	vec2 uv = (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    uv.xy *= 1.0+sin(iTime+uv.y+uv.x*2.0)*0.2;
    uv *= rot(iTime*0.1);

    // dirty grid blending attempt #3
    vec2 id;
    vec2 id2;
    float zoom = 8.0;
    zoom += sin(t)*2.0;
    
    float zoom2 = zoom;
    
    vec4 h = HexGrid(uv*zoom2, id);
    vec4 h2 = TriGrid(uv*zoom, id2);
    h.x = smin(h.x,h2.x,0.215); // blend distance
    id = mix(id,id2,0.5); // blend IDs
    vec3 bordercol = vec3(0.9,0.9,0.7);
    vec3 shapecol = vec3(0.41,0.32,0.15);//vec3(0.25,0.32,0.15);
    // just do a simple patterned shape tint based on (blended) cell IDs
    float patternVal = 7.75; // 33.5
    float cm = 1.0 + pow(sin(length(id)*patternVal + t*0.65), 4.0);	// pulse mult
    cm *= 1.0 + (hbar(h.zw,100.0,t*12.0)*0.1);					// bars mult
    shapecol *= cm;
    
    //bordercol *= 0.75+sin(iTime+length(uv*4.0))*0.25;
    //bordercol = shapecol*1.5;
    
    // Output to screen
    vec3 finalcol = mix(vec3(0.0),shapecol,smoothstep(0.0, 0.035, h.x-0.035)); // black outline edge
    float vv = smoothstep(0.0, 0.055, h.x);
    finalcol = mix(bordercol,finalcol,vv); // white edge

    fragColor = vec4(finalcol,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}