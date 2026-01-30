/*
 * Original shader from: https://www.shadertoy.com/view/3llBWj
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
#define R iResolution.xy
#define SS(U) smoothstep(0.,PX,U)
#define T iTime/5.
#define S ((1.+sin(T/2.))/4.+.5)
#define PX (S*6.)/R.y

void mainImage( out vec4 c, in vec2 f )
{
    vec2 p = S*(2.*f-R)/R.y;
    p+=vec2(cos(T),sin(T));
    
    float s = 1., l;
    
    for(int i=0;i<100;i++)
    {
        l = dot(p,p)/2.;
        
        s /= l;
        p /= l;
        
        p.xy = p.yx;
        
        p.x = mod(p.x,2.)-1.;
    }
    
    p/=s;
    
    c.rgb = vec3(SS(length(p)));
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}