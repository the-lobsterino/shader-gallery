/*
 * Original shader from: https://www.shadertoy.com/view/cddSR2
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

// --------[ Original ShaderToy begins here ]---------- //
//                = Alien Planet Exploration =         
//               by  Maximilian Knape ·∑>| 2023            
// -----------------------------------------------------------
// This work is licensed under a Creative Commons Attribution-
//        NonCommercial-ShareAlike 3.0 Unported License

#define GAMMA 2.2
#define FOV 120.
#define FEYE .85

#define MAX_STEPS 200
#define STEP_FAC .8
#define MAX_DIST 200.
#define MIN_DIST .1

#define GLOW_INT 1.0
#define PP_ACES 0.5
#define PP_CONT 0.2
#define PP_VIGN 3.0
#define AO_OCC 0.3
#define AO_SCA 0.7

//#define iTime iTime*1.0
#define PI 3.14159265
#define TAU 6.28318531
#define S(x,y,t) smoothstep(x,y,t)

vec3 hsv2rgb_smooth(in vec3 c) //IQ
{
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
	rgb = rgb*rgb*(3.0-2.0*rgb);
	return c.z * mix(vec3(1.0), rgb, c.y);
}

mat2 Rot(in float a)
{
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

vec3 posCol;
vec2 Map(vec3 p)
{    
    if (p.y > 40. || p.y < 0.) return vec2(10., 0.);
    
    float scale = 1.2, k, r2, col = 0.;
    vec3 op = p;
    
    for(float i = 0.; i < 7.; i++) 
    {
        r2 = dot(p,p);
        scale *= k = max(.1, 10. / r2);
        p = vec3(2,4,.7) - abs(abs(p) * k - vec3(2,4,3));

        col += length(op - p) / 140.; 
        op = p;
    }

    float sp = step(1.66, max(.1, 10. / r2));
    col += sp / 1.6;

    float b = 1. + (sp*sin(iTime*2. + p.y*3. + length(p)/3.)*.05); 
    float d = min(length(p.xz), p.y*b - 1.9) / scale;

    posCol = p;

    return vec2(d, col*sp);
}

float SurfDis(float depth) //Cone Marching 
{  
    return depth * tan(FEYE*PI*FOV/360.) / iResolution.y;
}

vec3 Normal(in vec3 p, in float depth) //tetrahedron differences
{
    float h = SurfDis(depth);
    vec2 k = vec2(1.,-1.);

    return normalize(   k.xyy * Map(p + k.xyy * h).x + 
                        k.yyx * Map(p + k.yyx * h).x + 
                        k.yxy * Map(p + k.yxy * h).x + 
                        k.xxx * Map(p + k.xxx * h).x );
}

vec3 RayMarch(vec3 ro, vec3 rd) 
{
    float col = 0.;
	float dO = MIN_DIST;
    int steps = 0;
    
    for(int i = 0; i < MAX_STEPS; i++) 
    {
        steps = i;
        
    	vec3 p = ro + rd*dO;
        vec2 dS = Map(p);
        col = dS.y;
        dO += dS.x * mix(STEP_FAC, 1., dO/MAX_DIST);
        
        if (dO > MAX_DIST || dS.x < SurfDis(dO)) break;
    }
    
    return vec3(dO, steps, col);
}

float softshadow2( in vec3 ro, in vec3 rd, in float dis, float w)
{
    float res = 1.;
    float t = .1;
    float d = (MAX_DIST-dis)*.5;
    
    //the shadow "problem" - something IQ like
    for(int i = 0; i < 24; i++)
    {
        if (t >= d) break;
        float h = Map(ro + t*rd).x;
        res = min( res, h/(w*t));
        t += clamp(log(h+1.), .01, 1.);
        if( res < -1. || t > d) break;
    }
    
    res = clamp(res*2., -1., 1.); //Smoothstep
    return 0.25*(1.0+res)*(1.0+res)*(2.0-res);
}

float CalcAO(const in vec3 p, const in vec3 n) //iq
{
    float occ = AO_OCC;
    float sca = AO_SCA;

    for( int i = 0; i < 5 ; i++ )
    {
        float h = 0.001 + 0.150 * float(i) / 4.0;
        float d = Map(p + h * n).x;
        occ += (h - d) * sca;
        sca *= 0.95;
    }
    return S(0.0, 1.0 , 1.0 - 1.5 * occ);    
}

const vec3 ambCol = vec3(.01,.02,.05);
const vec3 sunCol = vec3(1., .8, .6);
const vec3 skyCol = vec3(.3, .5, 1.);
const float specExp = 15.;

vec3 Sky(vec3 rd, vec3 lPos, float depth)
{
    float sun = 0.;

    float gnd = smoothstep(-.2, .3, dot(vec3(0,1,0), rd));
    vec3 col = mix((ambCol + skyCol + sunCol) / 8., skyCol, gnd);

    if (gnd > 0.)
    {
        float dir = dot(normalize(lPos), rd)*.5+.5;
        sun = depth >= 1. ? smoothstep(1. - 2e-4, 1., dir) : 0.;
        sun += pow(dir, 10.) * pow(depth,.3)*.3;
    }

    return S(vec3(0), vec3(1), col + (sun * sunCol * gnd));
}


vec3 Shade(vec3 col, float mat, vec3 p, vec3 n, vec3 rd, vec3 lp, float dis) 
{

    vec3    lidi = normalize(lp - p);
    float   mafa = max(mat, .0),
            amoc = CalcAO(p, n),
            shad = softshadow2(p, normalize(lp), dis, .1),
            diff = max(dot(n, lidi), 0.) * shad,
            spec = pow(diff, max(1., specExp * mafa)),
            refl = pow(max(0., dot(lidi, reflect(rd, n))), max(1., specExp * 3. * mafa)) * shad;

    return  col * (amoc * ambCol +                                           //ambient
                   (1. - mafa) * diff * sunCol +                             //diffuse
                   mafa * (spec + refl) * sunCol +                           //specular
                   max(-mat, 0.) * smoothstep(0., 1., amoc * amoc + .5));    //emission
}

vec4 PP(vec3 col, vec2 uv)
{
    col = mix(col, (col * (2.51 * col + 0.03)) / (col * (2.43 * col + 0.59) + 0.14), PP_ACES);
    col = mix(col, S(vec3(0.), vec3(1.), col), PP_CONT);    
    col *= S(PP_VIGN,-PP_VIGN/5., dot(uv,uv)); 
    col = pow(col, vec3(1) / GAMMA);
    
    return vec4(col, 1.);
}

vec3 R(in vec2 uv, in vec3 p, in vec3 l)
{
    float z = tan(((180. - FOV) * PI) / 360.);
    vec3  f = normalize(l - p),
          r = normalize(cross(vec3(0,1,0), f)),
          u = cross(f,r),
          c = p + f*z,
          i = c + uv.x*r + uv.y*u,
          d = normalize(i - p);
    return d;
}

vec3 Path(float t, int ix)
{
         if (ix == 0) return vec3(sin(t*2.)*30., 10.+cos(t*4.)*5., cos(t)*45.); //loop-ride A
    else if (ix == 1) return vec3(sin(t)*28., 11.+cos(t*4.)*5., sin(t*2.)*50.); //loop-ride B
    else if (ix == 2) return vec3(sin(t)*66., 9.+sin(t*6.-.05)*5., cos(t)*60.); //ring-ride
    return vec3(0);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - .5*iResolution.xy) / iResolution.y;
    vec2 fe = normalize(uv) * tan(sqrt(dot(uv,uv)) / FEYE) * (FEYE*FEYE);
	vec2 m = iMouse.xy / iResolution.xy;
    float t = (iTime - sin(iTime/3.))/30.;
    
    if (length(m) <= 0.2) m = vec2(.5);
    else t = m.x * TAU; //stop animation
    int path = int(mod(t/PI + 1., 3.));
    float fade = 1. - pow(abs(cos(t)), 1e3);

    vec3 ro = Path(t, path);
    vec3 rd = R(fe, ro, Path(t+.2, path));
    
    vec3 rmd = RayMarch(ro, rd);
    
    vec3 lPos = vec3(1,2,3)*1e2;
    vec3 bg = Sky(rd, lPos, rmd.x/MAX_DIST);
    vec3 col = skyCol;
    vec3 p = vec3(0.);
    float f = 0.;
    float disFac = S(0., 1., pow(rmd.x / MAX_DIST, 1.2));
    
    if(rmd.x < MAX_DIST) 
    {
        p = ro + rd * rmd.x;
        vec3 n = Normal(p, rmd.x);
        
        float mat = rmd.z == 0. ? .9 : rmd.z < 0. ? rmd.z : .2;
        col = hsv2rgb_smooth(vec3(fract(rmd.z + iTime/70.), 1. - abs(mat)/2., .8));
       
        if (rmd.z > 0.) //glow waves
        {
            f = S(1.-min(2.,p.y/10.), 1., sin((p.y - iTime)/2.));
            f *= S(0., 1., dot(sin(posCol/2.), cos(p/2. + posCol/2.)));
            mat = -f*(1.-disFac);
            if (mat < 0.) col = mix(col, sin(col+length(p-posCol))*.5+.5, f);
        }
        
        col = Shade(col, mat, p, n, rd, lPos, rmd.x);
    }
    
    col = mix(col, bg, disFac);
    col += pow(rmd.y / float(MAX_STEPS), 2.-f) * normalize(sunCol) * GLOW_INT;
    
    fragColor = PP(col*fade, uv);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}