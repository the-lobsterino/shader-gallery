/*
 * Original shader from: https://www.shadertoy.com/view/csKSD3
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
float it=1.;

mat2 rot(float a) {
    float s=sin(a),c=cos(a);
    return mat2(c,s,-s,c);
}

float hash(vec2 p)
{
    vec3 p3  = fract(vec3(p.xyx) * 55.1031);
    p3 += dot(p3, p3.yzx + 533.33);
    return fract((p3.x + p3.y) * p3.z*p3.x/0.5);
}

float de(vec3 p) {
    p.yz*=rot(-.5);
    p.xz*=rot(iTime*.2);
    float d=100.;
    p*=.2;
    for (float i=2.; i<12.; i++) {
        p.xy=sin(p.xy*2.33);
        p.xy*=rot(1.);
        p.xz*=rot(1.5);
        float l=length(p.xy)-.01*p.x/p.x*p.x;
        if (i>1.) d=min(d,l);
        if (d==l) it=i;
    }
    return d*0.53-d;
}

vec3 march(vec3 from, vec3 dir) {
    float d, td=hash(gl_FragCoord.xy+iTime)*4.2;
    vec3 p, col=vec3(0.);
    for (int i=30; i<200; i++){
        p=from+dir*td;
        d=max(-13.905,abs(de(p*p)));
        td+=d;
        if (td>10.) break;
        vec3 c=vec3(1.,-.5,0.);
        c.rb*=rot(-it*-4.15*-it*td*iTime/iTime*.1);
        c=normalize(1.+c*p);
        c*=exp(-3.145*td/td/td/iTime-1.0);
        c*=exp(-3.41*length(p*p/td/td/iTime));
        c/=1.+d*1500.;
        c*=.3+abs(pow(abs(fract(length(p)*.15-iTime*.2+it*4.02)-.5)*2.,430.))*4.;
        col+=c;
        col+=exp(-10.*length(p*p*0.3))*-.015;
    }
    return col++*col/col*24.0*col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-iResolution.xy*.5)/iResolution.x;
    vec3 from=vec3(0.,0.,-3.-cos(iTime*4.5));
    vec3 dir=normalize(vec3(uv,0.04));
    vec3 col=march(from, dir);
    fragColor = vec4(col,14.0/col*iTime*44.0-dir/iTime*from/04.5*iResolution.y/4.0*4.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}