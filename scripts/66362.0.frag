/*
 * Original shader from: https://www.shadertoy.com/view/wl2yDt
 */

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define R resolution.xy
#define PI 3.14159265

vec2 hash22(vec2 p)
{
    vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx+33.33);
    return fract((p3.xx+p3.yz)*p3.zy);
}

vec3 hash31(float p)
{
   vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
   p3 += dot(p3, p3.yzx+33.33);
   return fract((p3.xxy+p3.yzz)*p3.zyx); 
}

float sdSegment( in vec2 p, in vec2 a, in vec2 b )
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}

vec2 perlin(vec2 p)
{
   vec2 pi = floor(p);
   vec2 pf = p - pi;
   vec2 pfc = 0.5 - 0.5*cos(pf*PI);
   vec2 a = vec2(0.,1.);
   
   vec2 a00 = hash22(pi+a.xx);
   vec2 a01 = hash22(pi+a.xy);
   vec2 a10 = hash22(pi+a.yx);
   vec2 a11 = hash22(pi+a.yy);
   
   vec2 i1 = mix(a00, a01, pfc.y);
   vec2 i2 = mix(a10, a11, pfc.y);
   
   return 0.5 + 0.5*mix(i1, i2, pfc.x);
}

vec2 dir(float x)
{
    return vec2(cos(x), sin(x));
}

vec2 wind(vec2 p, float t)
{
    t*=5.;
    
    vec2 dx =  
           0.04*dir(dot(p, vec2(-0.3, -0.5)) + 1.133*t)+
           0.1*dir(dot(p, vec2(0.1, 0.11)) + 0.431*t)+
           0.2*dir(dot(p, vec2(-0.12, 0.1)) + 0.256*t);
    return 0.6*dx;
}

vec2 windDX(vec2 p, float t)
{
    t*=5.;
    
    vec2 dx =  
           0.04*vec2(-0.3, -0.5)*dir(dot(p, vec2(-0.3, -0.5)) + 1.133*t - PI*0.5)+
           0.1*vec2(0.1, 0.11)*dir(dot(p, vec2(0.1, 0.11)) + 0.431*t - PI*0.5)+
           0.2*vec2(-0.12, 0.1)*dir(dot(p, vec2(-0.12, 0.1)) + 0.256*t - PI*0.5);
    return 0.6*dx;
}



//generate the cloth base texture

#define center R*0.5
#define L 1.
#define P 50.
vec3 level(vec2 p, vec2 s)
{
    vec2 dx = center - p;
    float f = perlin(dx + s).x;
    return vec3(f);
}

vec3 clothl(vec2 p)
{
    vec3 f = vec3(0.);
    vec3 d = vec3(0., 0., 1.);
    for(int i = 0; i < 2; i++)
    {
        f += level(d.z*p + d.xy, vec2(i)*1e3);
        d = vec3(d.x,d.y,0.3)*d + vec3(2.64, 1.5446, 0.);
    }
    return f;
}

#define cell_s 0.2


vec3 Ch0(vec2 fC)
{
    //create the weaving pattern
 	vec3 a = vec3(1.,.7,0.)*clothl(vec2(0.02, 8.)*fC);
    vec3 b = 1.2*vec3(1.,0.2,0.25)*clothl(vec2(8., 0.02)*fC);
    //checker modulation
    float M = (2.*smoothstep(-0.5,0.5,sin(PI*fC.x*cell_s)) - 1.)*
        	  (2.*smoothstep(-0.5,0.5,sin(PI*fC.y*cell_s)) - 1.);
    float Ma = smoothstep(-0.2,0.5,M);
    float Mb = smoothstep(0.2,-0.5,M);
    
    return 3.*(a*Ma + b*Mb);
}


#define center R*0.5
#define L 1.
#define P 50.

#define A 100.
#define light_dir normalize(vec3(0.36,0.6,0.7))

float abs_c(vec2 p)
{
	return length(Ch0(p));
}

vec2 grad(vec2 p)
{
	return vec2(abs_c(p+vec2(1,0)), abs_c(p+vec2(0,1))) - abs_c(p); 
}

vec4 cloth(vec2 p)
{
    vec4 col = vec4(0.);
    vec2 dx = wind(p*0.1, time);
    //displacement normal
    vec3 normal = normalize(vec3(A*windDX(p*0.1, time), 1.));
  	//diceplacement
    vec2 pos = p + A*dx; 
    //cloth normal modulation
      normal = normalize(1.6*normal + vec3(grad(pos),1));
    
    // magic shading stuff
    vec3 c = Ch0(pos);	//color
    float d = clamp(dot(normal, light_dir), 0., 1.);
    float s = pow(d, 20.);
    float B = 0.08*d + 0.05 + 0.2*s; //brightness
    col = vec4(B*c,1.); //blend
   
    return col;
}

vec3 tanh(vec3 x)
{
return (exp(x) - exp(-x)) / (exp(x) + exp(-x));
}


void main( void )
{
    // Output to screen
    gl_FragColor = vec4(tanh(2.*cloth(0.5*gl_FragCoord.xy).xyz),1.);
}
