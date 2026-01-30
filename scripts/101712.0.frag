/*
 * Original shader from: https://www.shadertoy.com/view/DdjXRd
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
const vec4 iMouse = vec4(0.);

// Emulate a black texture
#define texture(s, uv) vec4(0.0)
#define textureLod(s, uv, lod) vec4(0.0)
#define texelFetch(s, uv, lod) vec4(0.0)

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.5))

// --------[ Original ShaderToy begins here ]---------- //
// key toggles
// M: mode 1 or 2
// A: anti-aliasing
// R: rainbow fringes
#define KT(i) texelFetch(iChannel0, ivec2(i, 2), 0).x
#define HUE(a) (sin(vec3(0, 1.047, 2.094)+vec3(a*6.3))*.5+.5)
#define RT(a) mat2(cos(m.a*1.57+vec4(0,-1.57,1.57,0)))

void mainImage( out vec4 RGBA, in vec2 XY )
{
    bool  km = KT(77) > 0.;      // switch mode: m key
    float t = iTime/15.+.001,
          aa = 2.-KT(65),        // anti-aliasing: key a
          d, s;
    vec2  R = iResolution.xy,
          m = iMouse.xy/R*4.-2., // mouse coords
          o;
    vec3  bg = vec3(0),          // background
          ro = vec3(.5, 0, t),   // camera (ray origin)
          rd, l, c;
    
    if (iMouse.z < 1.) m = vec2(-cos(t)*.4+.4)+vec2(0,.1); // rotate with time
    
    for (int k = 0; k < 4; k++) // anti-aliasing
    {
        o = vec2(k==1, k/2)/aa; // offset for aa
        rd = normalize(vec3((XY-.5*R+o)/R.y, 1)); // 3d uv (ray direction)
        rd.yz *= RT(y); // pitch
        rd.xz *= RT(x); // yaw
        d = 0.; // step dist for raymarch
        for (int i = 0; i < 100; i++)
        {
            vec3 p = ro+rd*d; // position along ray
            if (km) p.xz += round(p.y)*t;            // mode 2
            else    p.z  += sqrt(round(p.y)*t*t*2.); // mode 1
            s = smoothstep(.23, .27, length(p-round(p)) ); // sphere grid
            if (s < 0.001) break;
            d += s;
        }
        l = 1.-vec3( length(rd.yz), length(rd.xz), length(rd.xy) ); // spots at xyz
        c = vec3(d*.013); // objects
        c += vec3(.9, .5, .2)-min(1.-l.x, 1.-l.z); // firey glow
        c.b += l.x*.5 + l.y*1.5; // x & y tint
        if (km) c = c.gbr; // change color with mode
        if (KT(82) < 1.) c = max(c, .5-HUE(d)); // rainbow fringe
        bg += c; // add to bg
    }
    bg /= aa*aa; // fix brightness after aa pass
    bg *= sqrt(bg)*.8; // contrast
    RGBA = vec4(bg, 1.);
} 
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}