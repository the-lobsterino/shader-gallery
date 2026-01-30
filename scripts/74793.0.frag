/*
 * Original shader from: https://www.shadertoy.com/view/Nsd3Wl
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
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
/*

    Mysterious Roman dodecahedron
    -----------------------------
    
    While visiting the Lugdunum Museum at Lyon (France) I was shocked by a very strange artifact ! 
    
    A Roman dodecahedron or Gallo-Roman dodecahedron is a small hollow object 
    made of copper alloy which has been cast into a regular dodecahedral shape: 
    twelve flat pentagonal faces, each face having a circular hole of varying 
    diameter in the middle, the holes connecting to the hollow center. 
    Roman dodecahedra date from the 2nd to 4th centuries AD.    

    Some people suggested it is a simple tool to make gloves because they are found 
    only on the north of Europe, I prefer to think it's a kind of mystic object. 
    We will probably never know !
    
    It's amazing what people were able to do even before Shadertoy was created.

    Related references:
    
    Roman dodecahedron - Wikipedia
    https://en.wikipedia.org/wiki/Roman_dodecahedron

    icosahedronal symmetry & Icosahedron Weave - DjinnKahn
    https://www.shadertoy.com/view/Mly3R3
    https://www.shadertoy.com/view/Xty3Dy
        
    IQ Distance functions
    https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm

    smooth minimum - IQ
    https://iquilezles.org/www/articles/smin/smin.htm
    
    soft shadows in raymarched SDFs - IQ
    http://iquilezles.org/www/articles/rmshadows/rmshadows.htm

    RayMarching starting point - BigWIngs
    https://shadertoy.com/view/WtGXDD

*/

/*
    icosahedronal symmetry & Icosahedron Weave - DjinnKahn
    https://www.shadertoy.com/view/Mly3R3
    https://www.shadertoy.com/view/Xty3Dy
*/

const float PI = 3.14159265359;
const float PHI = (1.+sqrt(5.))/2.;
const float A = PHI / sqrt( 1. + PHI*PHI );
const float B = 1. / sqrt( 1. + PHI*PHI );
const float J = 0.309016994375;
const float K = J+.5;
const vec3 ICOVERTEX  = vec3(0,A,B);
const vec3 ICOMIDFACE = vec3(0,A,B)*(1./3.) + vec3(0,0,A)*(2./3.);
const vec3 ICOMIDEDGE = vec3(0,A,B)*.5 + vec3(B,0,A)*.5;
const mat3 R0 = mat3(0.5,-K,J        ,K,J,-0.5                       ,J,0.5,K                          );
const mat3 R1 = mat3(K,J,-0.5        ,J,0.5,K                        ,0.5,-K,J                         );
const mat3 R2 = mat3(-J,-0.5,K       ,0.5,-K,-J                      ,K,J,0.5                          );      
const mat3 R3 = mat3(-0.5,sqrt(.75),0,K,0.467086179481,0.356822089773,-J,-0.178411044887,0.934172358963);
const mat3 R4 = mat3(0.587785252292,-K,0.,-0.425325404176,-J,0.850650808352,0.688190960236,0.5,0.525731112119);

vec3 opIcosahedron( vec3 p )
{    
    p = R0 * abs( p );
    p = R1 * abs( p );
    p = R2 * abs( p );
    return abs( p );  
}    

// http://iquilezles.org/www/articles/smin/smin.htm
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float smax( float a, float b, float k )
{
    float h = max(k-abs(a-b),0.0);
    return max(a, b) + h*h*0.25/k;
}

mat2 Rot(float a) {
    float s=sin(a), c=cos(a);
    return mat2(c, -s, s, c);
}

float sdSphere( vec3 p, float r )
{
	return length(p) - r;
}

#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .001
#define T iTime*.3

float GetDist(vec3 p) {
    p.xz *= Rot(T);
    float radius = 1.0;
    vec3 q = opIcosahedron( p );
    // Dodecahedron distance to a face
    vec3 pDode = R4 * (q - ICOMIDFACE*radius);
    float dDode = sdSphere( vec3( max(pDode.xy, 0.), pDode.z ), .05 );
    // Holes are centered on the dodecaheron's faces that are icosahedron's vertrices
    vec3 pHole = R4 * (q - ICOVERTEX*radius);
    float dHole = length(pHole.xy) - radius * .2;    
    // Spheres on the vertrices
    vec3 pCorners = R3 * (q - ICOMIDFACE*radius * 1.2 );
    float dCorners = length(pCorners);    
    float dist = smax(dDode,-dHole,.1);
    dist = smin(dist,dDode+.02,.01);
    dist = smax(dist,-(dHole+.1),.05);
    dist = smin(dist,dCorners-.12,.1);
    return dist;
}

float RayMarch(vec3 ro, vec3 rd) {
	float dO=0.;
    for(int i=0; i<MAX_STEPS; i++) {
    	vec3 p = ro + rd*dO;
        float dS = GetDist(p);
        dO += dS;
        if(dO>MAX_DIST || abs(dS)<SURF_DIST) break;
    }
    return dO;
}

vec3 GetNormal(vec3 p) {
	float d = GetDist(p);
    vec2 e = vec2(.001, 0);
    vec3 n = d - vec3(
        GetDist(p-e.xyy),
        GetDist(p-e.yxy),
        GetDist(p-e.yyx));
    return normalize(n);
}

vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z) {
    vec3 f = normalize(l-p),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f,r),
        c = f*z,
        i = c + uv.x*r + uv.y*u,
        d = normalize(i);
    return d;
}

float calcSoftshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
{
    float res = 1.0;
    float t = mint;
    for( int i=0; i<24; i++ )
    {
		float h = GetDist( ro + rd*t );
        float s = clamp(8.0*h/t,0.0,1.0);
        res = min( res, s*s*(3.0-2.0*s) );
        t += clamp( h, 0.02, 0.2 );
        if( res<0.004 || t>tmax ) break;
    }
    return clamp( res, 0.0, 1.0 );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
	vec2 m = (2.0*iMouse.xy-iResolution.xy)/iResolution.y;

    vec3 ro = vec3(0, 0, -2.8);
    if ( iMouse.x > 0.0 ) {
        ro.yz *= Rot(-m.y*3.14);
        ro.xz *= Rot(-m.x*6.2831);
    }    
    vec3 rd = GetRayDir(uv, ro, vec3(0,0.,0), 1.0);
    vec3 orange = vec3(1.00,.25,0.01);
    vec3 sun   = vec3(1.64,1.27,0.99);
    vec3 col = orange*(1.-abs(rd.y)); // fast gradient - "the sky will be blue" - https://youtu.be/Cfe5UQ-1L9Q?t=2795
   
    float d = RayMarch(ro, rd);

    if(d<MAX_DIST) {
        vec3 p = ro + rd * d;
        vec3 nor = GetNormal(p);
        vec3  sun_lig = normalize( vec3(-1.00, 1.00, -1.00) );
        vec3  sec_lig = normalize( vec3( 2.00, 1.00, -1.00) );
        float sun_sha = calcSoftshadow( p+0.01*nor, sun_lig, 0.01, 2.1 );
        float sec_sha = calcSoftshadow( p+0.01*nor, sec_lig, 0.01, 2.1 );
        col = vec3(.001); // mysteriously totally black, no diffuse light
        vec3 r = reflect(rd, nor);
        float spec =     clamp(pow(max(0., dot(r,sun_lig)), 32.),0.0,1.0);
        float sec_spec = clamp(pow(max(0., dot(r,sec_lig)), 16.),0.0,1.0 );
        col += spec     * sun    * sun_sha;
        col += sec_spec * orange * sec_sha; 
    } 
    
    col = pow(col, vec3(.4545));	// gamma correction
    
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}