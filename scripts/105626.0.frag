// https://www.shadertoy.com/view/7dX3Dj

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec3 mouse;

// shadertoy emulation
#define iTime time
#define iMouse mouse
#define iResolution vec3(resolution ,0.1)
mat2 inverse(mat2 m) {
  return mat2(m[1][1],-m[0][1],
             -m[1][0], m[0][0]) / (m[0][0]*m[1][1] - m[0][1]*m[1][0]);
}
// nice hex function from - https://www.shadertoy.com/view/lldfWH
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
    id*=inverse(mat2(1.1547,0.0,-0.5773503,1.0)); // optional unskew IDs
    return vec4(0.5-max(uv.y,abs(dot(vec2(0.866026,0.5),uv))),length(co),co);
}

// Triangle grid using the skewed, split rectangle method (quicker)
// this version based on fabrices excellent hexagonal tiling tutorial (I wish I'd found this earlier!!)
// https://www.shadertoy.com/view/4dKXR3
vec4 TriGrid(vec2 uv, out vec2 id)
{
    uv *= mat2(1,-1./1.73, 0,2./1.73);
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
    return vec4((1.0-edge)*0.43,length(triuv),triuv);
}

// simple square grid equiv
vec4 SquareGrid(vec2 uv, out vec2 id)
{
    uv += 0.5;
    vec2 fs =  fract(uv)-0.5;
    id = floor(uv);
    vec2 d = abs(fs)-0.5;
    float edge = length(max(d,0.0)) + min(max(d.x,d.y),0.0);
    return vec4(abs(edge),length(fs),fs.xy);
}

// simple diamond grid equiv
vec4 DiamondGrid(vec2 uv, out vec2 id)
{
    uv = uv* mat2(1,-1,1,1);
    return(SquareGrid(uv,id));
}

// simple brick grid equiv
vec4 BrickGrid(vec2 uv, out vec2 id)
{
    vec2 pos = uv * vec2(1.0,2.0);
    if(fract(uv.y)>0.5)
        pos.x += 0.5;
    id = floor(pos);
    id.y *= 0.5;
    pos = fract(pos);
    vec2 uv2 = fract (pos)-0.5;
    uv2.y *= 0.5;
    pos=abs(fract (pos + 0.5) - 0.5);
    float d = min(pos.x,pos.y*0.5);
    return vec4(abs(d),length(uv2),uv2);
}

// Shanes ocatagonal-diamond grid equiv - https://www.shadertoy.com/view/3tGBWV 
vec4 OcatagonalGrid(vec2 uv, out vec2 id)
{
    vec2 guv;
    vec2 p = uv - .5;
    id = floor(p) + .5;
    p -= id;
    float d = abs(p.x) + abs(p.y) - (1. - sqrt(2.)/2.);
    if(d<.0)
    {
        // inside a diamond
        guv = fract(p-0.5)-0.5;
        id += .5;
    }
    else
    {
        // inside an octagon
        guv = fract(p)-0.5;
        p = uv;
        id = floor(p) + .5;
        p -= id;
        d = max((abs(p.x) + abs(p.y))/sqrt(2.), max(abs(p.x), abs(p.y))) - .5;
    }
    return vec4(abs(d), length(guv), guv);
}


float hbar(vec2 p, float nline, float t)
{
    return 0.5+sin((p.y*nline)+t)*0.5;
}

// Demo 6xGrids or Let the user select a grid with mouse...
float SelectGrid(vec2 xxyy)
{
    float gridtype = 0.5;
    vec2 mx = ((iMouse.xy-.5*iResolution.xy) / iResolution.xy)+0.5;
    if (iMouse.z>0.5)
        xxyy=mx;
    if (xxyy.x>0.66)
        gridtype=2.5;
    else if (xxyy.x>0.33)
        gridtype = 1.5;
    if (xxyy.y<0.5)
        gridtype+=3.0;
    return gridtype;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float t = iTime;
	vec2 uv = (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    float xx = ((fragCoord.x-.5*iResolution.x) / iResolution.x)+0.5;
    float yy = ((fragCoord.y-.5*iResolution.y) / iResolution.x)+0.5;

    // dirty grid switching
    vec2 id;
    vec4 h;
    float zoom = 8.0;
    if (iMouse.z>0.5)
        zoom += sin(t);
    float gridtype = SelectGrid(vec2(xx,yy));
    if (gridtype>= 5.0)
        h = BrickGrid(uv*zoom, id);
    else if (gridtype>= 4.0)
        h = DiamondGrid(uv*zoom, id);
    else if (gridtype>= 3.0)
        h = OcatagonalGrid(uv*zoom, id);
    else if (gridtype>= 2.0)
        h = SquareGrid(uv*zoom, id);
    else if (gridtype>=1.0)
        h = HexGrid(uv*zoom, id);
    else
        h = TriGrid(uv*zoom, id);

    vec3 bordercol = vec3(1.0,1.0,1.0);
    vec3 shapecol1 = vec3(0.35,0.15,0.2);
    vec3 shapecol2 = vec3(0.9,0.9,0.45);
    
    // just do a simple patterned shape tint based on cell IDs
    float patternVal = .5; // 33.5
    float blend = pow(abs(sin(length(id)*patternVal + t*0.65)), 4.0);	// pulse mult
    float cm = 1.0 + (hbar(h.zw,100.0,t*12.0)*0.1);					// bars mult

    vec3 shapecol = mix(shapecol1,shapecol2,blend)*cm;
    vec3 finalcol = mix(vec3(0.0),shapecol,smoothstep(0.0, 0.035, h.x-0.035)); // black outline edge
    float vv = smoothstep(0.0, 0.055, h.x);
    finalcol = mix(bordercol,finalcol,vv*vv); // white edge
    finalcol = mix(vec3(0.0),finalcol,smoothstep(0.0, 0.035, h.y-0.035)); // black outline centre
    vv = smoothstep(0.0, 0.055, h.y);
    finalcol = mix(bordercol,finalcol, vv*vv);  // white centre

    if (iMouse.z<0.5)
    {
        // add some red divider lines
        float dd = max( step(abs(xx-0.33),0.0025), step(abs(xx-0.66),0.0025));
        dd = max(dd,step(abs(yy-0.5),0.0025));
        finalcol = dd<1.0 ? finalcol : vec3(1.0,0.3,0.3);
    }

    //finalcol = vec3(h.x,h.x,h.x); // just show cell edge distance
    //finalcol = vec3(h.zw,0.0);    // just show cell uv
    //finalcol = vec3(h.y,h.y,h.y); // just show cell centre distance
    fragColor = vec4(finalcol,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}