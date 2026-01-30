/*
 * Original shader from: https://www.shadertoy.com/view/st2fR3
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
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    float t=iTime;
    vec2 r=iResolution.xy;
    vec3 c,p,n,
    ro=vec3(0.,0.3,t*.3)+5.*(vec3(iMouse.xy/r,0.)*2.-1.),
    rd=normalize(vec3((fragCoord.xy*2.-r)/min(r.x,r.y),1.)),
    l1=ro+vec3(3.+sin(t)*5.,2.+sin(5.-t*.4),2.+cos(t*.6)),
    l2=ro-vec3(2.-cos(t+2.)*3.,1.-sin(t*.8)*2.,1.),
    l3=ro-vec3(-3.,1.+cos(t+7.)*2.,2.+sin(-t*.38+.9)*4.);
    float d=.5,e=1.;
    for(float i=0.;i<99.;i++){
        if (e<=.005) break;
        p=ro+rd*d;
        p.z+=p.x*.1;
        p.x+=sin(p.z+p.y*.4);
        p.y+=cos(p.z+p.x*.3);
        n=l1-p;c+=vec3(.5,1.,2.)/(1.+dot(n,n));
        n=l2-p;c+=vec3(1.5,.5,.5)/(1.+dot(n,n));
        n=l3-p;c+=vec3(.5,1.,.5)/(1.+dot(n,n));
        p=mod(p,2.)-1.;
        e=(length(p)-.35)*.3;
        d+=e;
    }
    fragColor = vec4(c*.04,1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}