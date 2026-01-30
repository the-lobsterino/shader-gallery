/*
 * Original shader from: https://www.shadertoy.com/view/cdXXRj
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

// --------[ Original ShaderToy begins here ]---------- //
#define hash(p)fract(sin(p)*4363.)

float n(vec2 p){
    vec2 r=vec2(1,99),s=dot(floor(p),r)+vec2(0,r.y);
    p=smoothstep(0.,1.,fract(p));
    vec2 a=mix(hash(s),hash(s+1.),p.x);
    return mix(a.x,a.y,p.y)*2.-1.;
}

vec2 rv(float s)
{
    vec2 n=hash(vec2(s,s+215.3))*2.-.1;
    return vec2(cos(n.y),sin(n.x));
}

vec2 rc(float t,float n)
{
    vec2 p = vec2(0);
    for (int i=0; i<3; i++){
        p+=rv(n+=135.)*sin((t*=.2)+sin(t*.3)*.5);
    }
    return p;
}

void mainImage( out vec4 O, in vec2 C )
{
    vec2 q,r=iResolution.xy,p=(C.xy-r*.5)/r.y*3.;
    O=vec4(1);
    float t=iTime,a=1.;
    p+=.5*rc(t,123.).xy;
    for(float j=0.;j<8.;j++){
        q=vec2(0);
        for(float i=1.;i>0.;i-=.03){
            q+= a*.15*vec2(
                n(vec2(i*150.-55.,j*50.+t*15.)*.01),
                n(vec2(i*200.+3.,j*25.+t*50.)*.01)
            );
            O-=.001/abs(length(p+q)-i*.15)/exp(i*.3);
        }
        a*=-1.;
    }

}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}