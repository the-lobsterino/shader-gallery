/*
 * Original shader from: https://www.shadertoy.com/view/MtlGDM
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
// Gomez by @Polyflare (30/1/15)
// License: Creative Commons Attribution 4.0 International

// Gomez is a character from the video game Fez by Polytron Corporation
// http://fezgame.com/

//-----------------------------------------------------------------------------
// User settings

// 0 = No antialiasing
// 1 = Antialiasing enabled
#define ANTIALIAS 0

// 0 = 2x2 supersampling
// 1 = 3x3 supersampling
#define ANTIALIAS_HQ 0

// 0 = Static camera
// 1 = Animate the camera
#define ANIMATE_CAM 1

// 0 = No noise in the background
// 1 = Add noise to the background to reduce banding
#define BG_NOISE 1

// 0 = No camera vignetting
// 1 = Camera vignetting enabled
#define BG_VIGNETTE 0

//-----------------------------------------------------------------------------

// Internal settings
#define MAX_STEPS 70
#define MAX_DIST 70.0
#define GEPS 0.001
#define HIT_DIST 0.005
#define LIGHT_DIR vec3(0.40825, 0.40825, 0.81650)
#define LIGHT_AMB 0.79588
#define LIGHT_DIF 0.25
#define TEX_OFFSET vec2(7.0, 8.0)
#define FLOOR_OFFSET vec3(0.0, 16.0, 0.0)

// High quality antialiasing is 3x3 grid while low quality is 2x2
#if ANTIALIAS_HQ
#define AA_XY 3
#define AA_SEP 0.333333
#define AA_OFF 0.333333
#define AA_MIX 0.111111
#else
#define AA_XY 2
#define AA_SEP 0.5
#define AA_OFF 0.25
#define AA_MIX 0.25
#endif

// Pixel colours
#define SKIN_COL vec3(1.0, 1.0, 1.0)
#define SKIN_LSHAD_COL vec3(0.8902, 0.9686, 0.8902)
#define SKIN_DSHAD_COL vec3(0.6667, 0.7255, 0.6667)
#define FACE_COL vec3(0.0, 0.0, 0.0)
#define TONGUE_COL vec3(0.9216, 0.1137, 0.3804)
#define FEZ_COL vec3(0.8392, 0.1176, 0.1176)
#define FEZ_SHAD_COL vec3(0.7529, 0.1059, 0.1059)
#define TASSEL_COL vec3(0.9333, 0.7333, 0.2667)
#define TASSEL_SHAD_COL vec3(0.8392, 0.6588, 0.2392)
#define BGT_COL vec3(0.6588, 0.4941, 0.8824)
#define BGB_COL vec3(0.5451, 0.3922, 0.749)

float box(vec3 p, vec3 offset, vec3 size)
{
	return length(max(abs(p - offset) - size, 0.0));
}

// Distance field of Gomez's silhouette
float scene(vec3 p)
{
    p.xy += TEX_OFFSET;
#define BOX(x1, y1, w, h) box(p, vec3(x1 + w * 0.5, y1 + h * 0.5, 0.0), vec3(w * 0.5, h * 0.5, 0.5))
    // Body
    float a =  BOX(1., 8.,  12., 7.);
    a = min(a, BOX(0., 9.,  14., 5.));
    a = min(a, BOX(4., 7.,  6.,  1.));
    a = min(a, BOX(3., 1.,  7.,  6.));
    a = min(a, BOX(1., 6.,  11., 1.));
    a = min(a, BOX(2., 5.,  9.,  1.));
    a = min(a, BOX(2., 0.,  2.,  1.));
    a = min(a, BOX(7., 0.,  2.,  1.));
    // Fez
    a = min(a, BOX(3., 16., 3.,  3.));
    a = min(a, BOX(2., 17., 1.,  1.));
    return a;
}

// Pixel colours
vec3 pixtocol(vec2 uv)
{
    uv += TEX_OFFSET;
    // Ugly, ugly, ugly
#define UVB(x1, y1, x2, y2) (uv.x > x1 && uv.x <= x2 && uv.y > y1 && uv.y <= y2)
    if(UVB(2., 13., 3., 15.) || UVB(1., 9., 2., 14.) || UVB(2., 9., 3., 10.) ||
       UVB(3., 8., 4., 9.) || UVB(6., 7., 7., 8.) || UVB(8., 7., 10., 8.) ||
       UVB(4., 6., 5., 7.) || UVB(4., 1., 5., 4.) || UVB(3., 0., 4., 1.) ||
       UVB(8., 1., 9., 2.) || UVB(7., 0., 8., 1.))
        return SKIN_LSHAD_COL;
    if(UVB(0., 0., 2., 15.) || UVB(2., 8., 3., 9.) || UVB(4., 7., 6., 8.) ||
       UVB(2., 0., 3., 6.) || UVB(3., 0., 4., 5.) || UVB(5., 0., 10., 2.) ||
       UVB(10., 5., 12., 7.))
        return SKIN_DSHAD_COL;
    if(UVB(6., 10., 10., 12.) || UVB(7., 9., 9., 10.) || UVB(3., 12., 4., 13.) || 
       UVB(12., 12., 13., 13.)) {
        if(UVB(6., 9., 8., 11.))
            return TONGUE_COL;
        return FACE_COL;
    }
    if(UVB(3., 16., 4., 18.))
        return FEZ_SHAD_COL;
    if(UVB(3., 18., 4., 19.))
        return TASSEL_COL;
    if(UVB(2., 17., 3., 18.))
        return TASSEL_SHAD_COL;
    return uv.y > 15.5 ? FEZ_COL : SKIN_COL;
}

// Ray-plane intersection where the plane crosses the origin. Returns the
// point of intersection.
vec3 rayplaneintersect(vec3 pos, vec3 dir, vec3 n)
{
    float d = -dot(pos, n) / dot(dir, n);
    return pos + d * dir;
}

// Calculate the normal at a point using distance field gradients
vec3 gradnormal(vec3 pos)
{
    vec3 v1 = vec3( 1.0, -1.0, -1.0);
    vec3 v2 = vec3(-1.0, -1.0,  1.0);
    vec3 v3 = vec3(-1.0,  1.0, -1.0);
    vec3 v4 = vec3( 1.0,  1.0,  1.0);
	return normalize(
        v1 * scene(pos + v1 * GEPS) + 
		v2 * scene(pos + v2 * GEPS) + 
		v3 * scene(pos + v3 * GEPS) + 
		v4 * scene(pos + v4 * GEPS)
    );
}

// Base raymarching algorithm
bool raymarch(inout vec3 pos, vec3 cdir)
{
    float dist = 0.0;
    float d;
    for(int i = 0; i < MAX_STEPS; i++) {
        d = scene(pos);
        if(d < HIT_DIST || dist > MAX_DIST)
        	break;
        dist += d;
        pos += cdir * d;
    }
    return d < HIT_DIST;
}

// How much is the specified point in shadow? 0 = Complete shadow
float shadowamount(vec3 pos)
{
    pos += LIGHT_DIR * (HIT_DIST * 1.1);
    float dist = 0.0;
    float dmin = 100.0;
    for(int i = 0; i < MAX_STEPS; i++) {
        float d = scene(pos + LIGHT_DIR * dist);
        dmin = min(dmin, d);
        if(d < HIT_DIST || dist > MAX_DIST)
        	break;
        dist += d;
    }
    return dmin < HIT_DIST ? 0.0 : 1.0;
}

float rand(vec2 co)
{
   return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

// Camera perspective based on [0..1] viewport
vec3 pixtoray(vec2 uv)
{
    vec3 pixpos;
    pixpos.xy = uv - 0.5;
    pixpos.y *= iResolution.y / iResolution.x; // Aspect correction
    pixpos.z = -0.6; // Focal length (Controls field of view)
    return normalize(pixpos);
}

// Render the scene from the normalised screen position
vec3 render(vec2 uv)
{
    vec3 cdir = pixtoray(uv);
    vec3 cpos = vec3(0.0, 0.0, 32.0); // Camera position
#if ANIMATE_CAM
    // Rotating camera
    float angt = sin(iTime * 0.25) * 0.5;
    float cost = cos(angt);
    float sint = sin(angt);
    cpos.xz = cost * cpos.xz + sint * vec2(-cpos.z, cpos.x);
    cdir.xz = cost * cdir.xz + sint * vec2(-cdir.z, cdir.x);
#endif
    
    vec3 p = cpos;
    vec3 frag;
    if(raymarch(p, cdir)) {
        // Hit Gomez. Move hit position towards the model to get the
        // correct pixel colour and then fetch it.
        vec3 n = gradnormal(p);
        p -= n * 0.1;
        frag = pixtocol(p.xy);
        // Lighting
        frag *= dot(LIGHT_DIR, n) * LIGHT_DIF + LIGHT_AMB;
    } else {
        // Background
        frag = mix(BGB_COL, BGT_COL, uv.y);
#if BG_NOISE
        frag = mix(frag, vec3(rand(uv)), 0.02);
#endif
        // Shadow
        p = rayplaneintersect(
            cpos + FLOOR_OFFSET, cdir, vec3(0.0, 1.0, 0.0)
        	) - FLOOR_OFFSET;
        // Clip shadow check to improve performance
        if(p.x > -32.0 && p.x < -4.0 && p.z > -56.0 && p.z < -15.0)
        	frag = mix(frag * LIGHT_AMB, frag, shadowamount(p));
    }
    return frag;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    fragColor = vec4(0.0, 0.0, 0.0, 1.0);
#if ANTIALIAS
    for(int y = 0; y < AA_XY; y++) {
        for(int x = 0; x < AA_XY; x++) {
        	vec2 offset = vec2(AA_SEP) * vec2(x, y) - vec2(AA_OFF);
			vec2 uv = (fragCoord.xy + offset) / iResolution.xy;
        	fragColor.rgb += render(uv) * vec3(AA_MIX);
    	}
    }
#else
	vec2 uv = fragCoord.xy / iResolution.xy;
    fragColor.rgb = render(uv);
#endif
#if BG_VIGNETTE
    vec2 buv = uv - 0.5;
    buv.y *= iResolution.y / iResolution.x; // Aspect correction
    fragColor.rgb *= 1.0 - pow(dot(buv, buv) * 2.0, 4.0) * 0.5;
    // Anamorphic alternative, iq-style
    //float cendist = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
    //fragColor.rgb *= pow(16.0 * cendist, 0.15) * 0.25 + 0.75;
#endif
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}