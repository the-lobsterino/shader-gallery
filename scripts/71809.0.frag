/*
 * Original shader from: https://www.shadertoy.com/view/tlVfDG
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
// 3D arbitrary axis rotation
// https://www.shadertoy.com/view/wtVyWK
#define R(p,a,r)mix(a*dot(p,a),p,cos(r))+sin(r)*cross(p,a)

// hue by FabriceNeyret2
#define hue(h)(cos((h)*6.3+vec3(0,23,21))*.5+.5)

vec3 trans(vec3 p)
{
    return R(p,normalize(vec3(1,1,2)),iTime*.1+.5);
}

float apollonian(inout vec3 p)
{
    // Control parameters
    //*
    float r=2.2;
    float x=1.;
    float y=2.;
    float z=2.;
    //*/
    
    // Other patterns(example)
    /*
    float r=12.5;
    float x=5.2;
    float y=7.1;
    float z=2.5;
    //*/
       
    // Fine-tune with some offsets
    // All numbers are offsets.
    // s=2. is a number that suppresses the progress of the ray.
    // If you see artifacts, increase the number.
    float e,s=2.;
    for(int i=0;i<8;i++){
        p=vec3(x-.2,y,z)-abs(p-vec3(x,y,z));
        e=(r+.1)/clamp(dot(p,p),.1,r);
        s*=e;
        p=abs(p)*e;
    }
    return min(length(p.xz),p.y)/s;
    //return length(p)/s;
}

float apollonian_std(inout vec3 p)
{
    // Control parameters
    float r=1.;
    float x=1.;
    float y=1.;
    float z=1.;

    float e,s=2.;
    for(int i=0;i<8;i++){
        p=vec3(x,y,z)-abs(p-vec3(x,y,z));
        e=r/clamp(dot(p,p),.0,r);
        s*=e;
        p=abs(p)*e;
    }
    return min(length(p.xz),p.y)/s;
    //return length(p)/s;
}


void mainImage(out vec4 O, vec2 C)
{
    O=vec4(0);
    vec3 p,r=iResolution,
    rd=normalize(vec3((C-.5*r.xy)/r.y,1)),
    ro=vec3(0,0,-1.8);
    
    float g=0.,e;
    for(float i=1.;i<99.;i++)
    {
        p=g*rd+ro;
        p=trans(p);
        // Achieves transparency with non-collision SDF
        g+=e=apollonian(p)+.001;
        //g+=e=apollonian_std(p)+.001;
        O.rgb+=mix(vec3(1),hue(length(p)),.6)*.0015/e/i;
    }

#if 1
    // Y axis
    g=0.;
    for(float i=1.;i<99.;i++){
        p=g*rd+ro;
        p=trans(p);
        g+=e=length(p.xz)-.005;
        e<.001?O.g+=.2/i:i;
    }

    // X grid
    g=0.;
    for(float i=1.;i<99.;i++){
        p=g*rd+ro;
        p=trans(p);
        p.xz=fract(p.xz-.5)-.5;
        g+=e=length(p.yz)-.005;
        e<.001?O.r+=.2/i:i;
    }

    // Z grid
    g=0.;
    for(float i=1.;i<99.;i++){
        p=g*rd+ro;
        p=trans(p);
        p.xz=fract(p.xz-.5)-.5;
        g+=e=length(p.xy)-.005;
        e<.001?O.b+=.3/i:i;
    }

    // Y axis point (pitch 1.0)
    g=0.;
    for(float i=1.;i<99.;i++){
        p=g*rd+ro;
        p=trans(p);
        p.y=fract(p.y-.5)-.5;
        g+=e=length(p)-.015;
        e<.001?O+=.3/i:O;
    }
#endif
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}