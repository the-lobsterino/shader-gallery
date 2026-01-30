/*
 * Original shader from: https://www.shadertoy.com/view/XsffRs
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniformsf
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define TAU 6.28318531
float C,S;
#define rot(a) mat2(C=cos(a),S=sin(a),-S,C)

float map(vec3 p) {
    p.yz*=rot(p.z*(.03*sin(iTime*2.)));
    p.xz*=rot(p.z*(.03*cos(iTime*1.)));
    float m=TAU/32.,
        l=length(p.xy),
        a=mod(atan(p.y,p.x)-p.z*.5+iTime*1.,m)-.5*m;
    return length(vec2(a*l,l-1.))-.8;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    uv-=.5;
    uv.x*=iResolution.x/iResolution.y;
    vec3 ro=vec3(uv,-3.),rd=normalize(vec3(uv,1.)),mp=ro;
    float i=0.;for (int ii=0;ii<30;++ii) {
        i++;
        float md=map(mp);
        if (abs(md)<.01)break;
        mp+=rd*md;
    }
    float r=i/30.;
    float d=length(mp-ro)*.1;
    vec3 c=mix(vec3(2.2,.5,.7)*d*d,vec3(.2,.4,.8)*r/d,r*r);
    c=sqrt(c);
	fragColor = vec4(c,1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}