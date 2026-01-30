/*
 * Original shader from: https://www.shadertoy.com/view/stSSWW
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
#define H(h)(cos((h)*6.3+vec3(0,23,21))*.5+.5)
void mainImage( out vec4 O, in vec2 C )
{
    O-=O;
    vec3 r=iResolution,
    p=vec3((C.xy-.5*r.xy)/r.y,0)-iTime*.05;
    p=asin(sin(p*3.));
    float s=1.,e;
    for(int i=0;i<7;i++)
        p=abs(p)-1.2,
        s*=e=3./clamp(dot(p,p),.8,2.),
        p=p*e-3.;
        O.xyz+=mix(vec3(1),H(log(s)*.5),.7)*3e-3/abs(p.z/s);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}