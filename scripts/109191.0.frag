/*
 * Original shader from: https://www.shadertoy.com/view/cdc3RX
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
mat2 rot(float th){
    return mat2(cos(th),sin(th),-sin(th),cos(th));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    const int n_iter=8;
    float s=0.;
    for(int k=0;k<n_iter;k++){
        float t = iTime + 0.0001 * float(k);
        float th = 0.1*t;
        float a = 0.4+0.3*mod(floor(t*0.1/6.2832), 3.0);    
        vec2 p = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);
        for (int i=0;i<50;++i){
            p.x += a * abs(p.y) - 0.3;
            p *= rot(th);
        }
        s += step(p.y,0.0);
    }
    s /= float(n_iter);
    fragColor = vec4(vec3(s),1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}