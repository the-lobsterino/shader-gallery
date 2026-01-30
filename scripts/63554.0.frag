/*
 * Original shader from: https://www.shadertoy.com/view/4s2yWc
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
mat2 rz2(float a){float c=cos(a),s=sin(a);return mat2(c,s,-s,c);}

struct M{float d;vec3 c;};
M m;

void map(vec3 p){
    p.xy*=rz2(iTime*.03);
    p.yz*=rz2(iTime*.05);
    p.xy*=rz2(iTime*.07);
    vec3 q=mod(p+2.5,5.)-2.5;
    vec3 f=floor((p-2.5)/5.);
    p=q;
    p.xy*=rz2(f.x+iTime);
    p.yz*=rz2(f.y+iTime);
    p.zx*=rz2(f.z+iTime);
    float d1=length(p)-1.;
    float a=atan(p.y,p.x);
    float d2=min(1.,abs(a)-(0.5+sin(iTime*10.)*.2))*length(p.xy);
    m.d=max(d1,d2);
    m.c=mix(vec3(1.,0.3,0.3),vec3(0.6,1.,0.6),smoothstep(.75,.85,length(p)));
    m.c=mix(m.c,vec3(0.,0.3,0.1),smoothstep(0.95,1.,length(p)));
    float mb=6.2831853/16.;
    float b=mod(atan(p.z,p.y),mb)-.5*mb;
    m.c=mix(vec3(0.),m.c,smoothstep(.18,.22,length(vec2(b*3.,length(p.xz)-0.2))));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv-=.5;
    uv.x*=iResolution.x/iResolution.y;
    vec3 ro=vec3(uv,-2.),rd=vec3(uv,1.),mp=ro;
    int i = 0;
    for (int ii=0;ii<50;++ii){
        map(mp);
        m.d*=.5;
        if(abs(m.d)<.001)break;
        mp+=rd*m.d;
        ++i;
    }
    float ma=1.-float(i)/50.;
    vec3 c=m.c*ma;
    fragColor = vec4(c,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}