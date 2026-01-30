/*
 * Original shader from: https://www.shadertoy.com/view/dsV3zc
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
#define n_tau 6.2831
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 o_trn_p = (fragCoord.xy - iResolution.xy*.5)  / iResolution.y;

    float n_ang_nor = fract(atan(o_trn_p.y, o_trn_p.x)/n_tau);
    float n_its = 8.;

    float n_it = (n_ang_nor * n_its);
    float n_it_fract = fract(n_it);
    float n_it_floor = floor(n_it);
    float n_it_nor = n_it_floor / n_its;

    float n_aa = (1./min(iResolution.x, iResolution.y))*3.;


    float n_lol = abs(n_it_fract-.5)*1.5;
    // n_lol = smoothstep(0.0, 0.9, n_lol);
    n_lol = 1.-n_lol;
    // n_lol = pow(n_lol, 1./1.);
    n_lol = smoothstep(0.5, .1, n_lol)*2.;
    n_lol = 1. - n_lol;
    // fragColor = vec4(n_lol);
    // return ;
    // float n_it_nor_trans = (n_it_floor / n_its)+(1./n_its/2.);

    float n_d_cntr = length(o_trn_p);
    
    vec2 o_p_online = vec2(
        cos((n_it_nor+(float(n_it_fract> .5)*(1./n_its))) * n_tau) * n_d_cntr,
        sin((n_it_nor+(float(n_it_fract> .5)*(1./n_its))) * n_tau) * n_d_cntr
    );
    float n_d_line1 = length(o_trn_p - o_p_online);
    float n_d_line = smoothstep(0.02, 0.02+n_aa, n_d_line1);


    float n_d_circ1 = length(o_trn_p);
    n_d_circ1 = smoothstep(0.4+n_aa, 0.4, n_d_circ1);

    float n_d_circ2 = length(o_trn_p);
    n_d_circ2 = smoothstep(0.15, 0.15+n_aa, n_d_circ2);

    float n = n_d_line*n_d_circ1*n_d_circ2;
    // float n = n_lol * n_d_circ1 * n_d_circ2;

    float b = float(fract(n_it_nor+iTime) >= 0.1);
    n = n * 0.3 + n * (1.-b);

    fragColor = vec4(n);


}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}