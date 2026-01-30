/*
 * Original shader from: https://www.shadertoy.com/view/WdjGWz
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

// Emulate a black texture
#define texture(s, uv) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
// Code by Flopine
// Thanks to wsmind, leon, XT95, lsdlive, lamogui, Coyhot and Alkama for teaching me
// Thanks LJ for giving me the love of shadercoding :3

// Cookie Collective rulz

#define ITER 64.
#define PI 3.141592
#define anim mod(iTime*10., 500.)

float hash(vec3 p)
{
    p  = fract( p*0.3183099+.1 );
	p *= 17.0;
    return fract( p.x*p.y*p.z*(p.x+p.y+p.z) );
}

mat2 rot (float a)
{return mat2 (cos(a),sin(a),-sin(a),cos(a));}

vec2 moda (vec2 p, float per)
{
    float a = atan(p.y, p.x);
    float l = length(p);
    a = mod(a-per/2., per)-per/2.;
    return vec2(cos(a), sin(a))*l;
}

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

vec3 rep3d (inout vec3 p, float per)
{
    vec3 id = floor((p-per/2.)/per);
    p = mod(p-per/2., per)-per/2.;
    return id;
}

float half_sphe (vec3 p, float r)
{
    float d = max(length(p)-r, abs(p.y-r/2.)-r/2.);
    return d ;
}

float cyl (vec3 p, float r, float h)
{return max(length(p.xy)-r,abs(p.z)-h);}

float g1 = 0.;
float od (vec3 p, float q)
{
	p.yz *= rot(iTime);
    float d = dot(p, normalize(sign(p)))-q;
    g1 += 0.1/(0.1+d*d);
    return d;
}

float tentacle (vec3 p)
{
    float o = od (vec3(p.x, p.y-12., p.z), 2.);
    p.xz *= rot(p.y*0.15);
    p.xz = moda(p.xz, PI/4.);
    p.x -= 5.;
    float t = cyl(p.xzy, 0.5+p.y*0.02, 20.);
    float d =  min(t, o);
    return d;
}

float g2 = 0.;
float bodies (vec3 p)
{
    p.y -= 5.;
    p.xz += sin(p.y*0.4+iTime);
    float hs = max(-half_sphe(vec3(p.x, p.y+1., p.z), 5.),half_sphe(p, 7.));
    p.y += 20.;
    float t = tentacle(p);
    float d = smin(hs, t, 1.5);
    g2 += 0.1/(0.1+d*d);
    return d;
    
}

float bubulle (vec3 p)
{
    p.y += iTime*0.6;
    vec3 id = rep3d(p, 10.);
    p.xy *= rot(iTime*0.1*hash(id));
    p += sin(iTime*hash(id));
    return length(p)-.2;
}

float SDF (vec3 p)
{
    p.y -= anim*1.2;
    float b = bubulle(p);
    p.xz *= rot(iTime*0.5);
    return min(bodies(p), b);

}

vec3 norms (vec3 p)
{
    vec2 eps = vec2(0.1,0.);
    return normalize(vec3(SDF(p+eps.xyy)-SDF(p-eps.xyy),
                          SDF(p+eps.yxy)-SDF(p-eps.yxy),
                          SDF(p+eps.yyx)-SDF(p-eps.yyx)
    					)
                    );
}

float lighting(vec3 n, vec3 l)
{return dot (n, normalize(l))*0.5+0.5;}


vec3 get_cam (vec3 eye, vec3 tar, vec2 uv, float fov)
{
    vec3 forward = normalize(tar-eye);
    vec3 left = normalize(cross(vec3(0.,1.,0.), forward));
    vec3 up = normalize(cross(forward, left));
    return normalize(forward*fov + left*uv.x + up * uv.y);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 q = fragCoord/iResolution.xy;
    vec2 uv = 2.*(q)-1.;
	uv.x *= iResolution.x/iResolution.y;
    uv += texture(iChannel0, uv+iTime*0.4).rg*length(uv*0.5)*0.1;
    
    vec3 ro = vec3(5.,3.+anim, -20.); vec3 p = ro;
    vec3 target = vec3(0., -6.+anim*1.2, 0.);
    vec3 rd = get_cam(ro,target, uv, 1.);
        
    bool hit = false;
    vec3 col = vec3(0.);
    float shad = 0.;
    
    for (float i=0.; i<ITER; i++)
    {
        float d = SDF(p);
        if (d<0.001)
        {
            hit = true;
            shad = i/ITER;
            break;
        }
        p += d*rd*0.4;
    }
    
    if (hit)
    {
        vec3 n = norms(p);
        col = mix(vec3(0.1,0.5,0.9), vec3(1.),lighting(n, vec3(2.,10.,-20.)));
    }
    
    // glow
	col += g1 * vec3(1.,0.7, 0.1);
	col += g2*vec3(uv.y,0.1,uv.y+2.)*0.2*clamp(sin(iTime), 0., 1.);
    
    // fog
    float t = length(ro-p); 
    col = mix(col, vec3(0.,0.08,0.2),1.-exp(-0.001*t*t));
    
    // vignetting from iq
    col *= 0.5 + 0.5*pow(16.0*q.x*q.y*(1.0 - q.x)*(1.0 - q.y), 2.);
    
    // gamma correct
    col = sqrt(col);

    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}