/*
 * Original shader from: https://www.shadertoy.com/view/sljGWz
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution vec3(resolution,1.)

// --------[ Original ShaderToy begins here ]---------- //
#define PI acos(-1.0)
#define TAU PI*2.0

#define hue(h)(cos((h)*6.3+vec3(0,23,21))*.5+.5)
#define hash(n) fract(sin(n)*5555.0)

vec3 randVec(float n)
{
    float a=(hash(n)*2.-1.)*TAU,b=asin(hash(n+215.3)*2.-1.);
    return vec3(cos(a),sin(a)*cos(b),sin(a)*sin(b));
}

vec3 randCurve(float t,float n)
{
    t*=0.15;
    vec3 p = vec3(0);
    for (int i=0; i<3; i++)
    {
        p += randVec(n+=365.)*sin((t*=1.3)+sin(t*0.6)*0.5);
    }
    return p;
}

vec3 eye(float time){
    float seed=12713.0;
    return randCurve(time,seed)*5.0;
}

vec3 target(float time){
    float seed=12713.0;
    return randCurve(time+2.5,seed)*5.0;
}

mat3 lookat(vec3 eye, vec3 target, vec3 up)
{
    vec3 w = normalize(target-eye), u = normalize(cross(w,up));
    return mat3(u,cross(u,w),w);
}

float SUM=0.; 
float TIME=0.;
float T=0.;

void Q(float interval){
  T=clamp((TIME-SUM)/interval,0.,1.);
  SUM=SUM+interval;
}

float apollonian(inout vec3 p)
{
    p=mod(p-2.,4.)-2.;
    
    float r=12.5;
    float x=5.2;
    float y=7.1;
    float z=2.5;
        
    SUM=0.;
    TIME = mod(iTime,18.);
    Q(2.);
    r+=T*T*3.;
    Q(2.);
    x-=T*T*5.;
    Q(2.);
    z-=T*T*2.;
    Q(2.);
    y-=T*T*3.;
    Q(2.);
    r+=T*T*2.;
    Q(2.);
    x+=T*T*2.;
    Q(2.);
    y+=T*T*3.;
    Q(2.);
    z+=T*T*4.;
          
    float e,s=2.;
    for(int i=0;i<6;i++){
        p=abs(p-vec3(x,y,z)*.05)-vec3(x,y,z-.3);
        e=(r+.2)/clamp(dot(p,p),.1,r);
        s*=e;
        p=abs(p)*e;
    }
    return min(length(p.xz),p.y)/s;
}

void mainImage(out vec4 O, vec2 C)
{
    O=vec4(0);
    vec3 p,r=iResolution;
    vec3 ro=eye(iTime);
    vec3 ta =target(iTime);
    vec3 rd=lookat(ro,ta,vec3(0,1,0))*normalize(vec3((C-.5*r.xy)/r.y,1));
    float g, e;
    g=1.5;
    for(float i=1.;i<99.;i++)
    {
        p=g*rd+ro;
        g+=e=apollonian(p)+.001;
        O.rgb+=mix(vec3(1),hue(length(p)*.2),.6)*.002/e/i;
    }

    g=0.;
    for(float i=1.;i<99.;i++){
        p=g*rd+ro;
        p=mod(p-.2,1.)-.5;
        g+=e=length(p.xz)-.005;
        e<.001?O.g+=.2/i:i;
    }

    g=0.;
    for(float i=1.;i<99.;i++){
        p=g*rd+ro;
        p=mod(p-.5,1.)-.5;
        g+=e=length(p.yz)-.005;
        e<.001?O.r+=.2/i:i;
    }

    g=0.;
    for(float i=1.;i<99.;i++){
        p=g*rd+ro;
        
        p=mod(p+.1,1.)-.5;
        g+=e=length(p.xy)-.005;
        e<.001?O.b+=.3/i:i;
    }
    O.xyz = min(O.xyz, .95);
    O.xyz = pow(O.xyz, vec3(.8,1.2,3.));
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}