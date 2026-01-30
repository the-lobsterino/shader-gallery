/*
 * Original shader from: https://www.shadertoy.com/view/DldGzX
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
/* "Synergy" by @kishimisu (2023) - https://www.shadertoy.com/view/ms3XWl 

   A 31-seconds seamless loop directed by trigonometry
*/

void mainImage(out vec4 O, vec2 F) {
    vec2   g  = iResolution.xy,
           o  = (F+F-g)/g.y/.7; 
    float  f  = iTime*.05-2.;
    O = vec4(0.0);
    
    //a bit messy but yeah :)
    O.xyz = vec3(0.2, 0.05, 0.15);
    for (float l = 0.; l < 55.; l++) {
    
        float group = mod(l, 10.) / 10.;
        float transition = fract(-iTime * 0.2 + group); 
        float depth = pow(transition, 0.5);
        vec2 offset = vec2(cos(l*f * 0.2), sin(l+f));
        float fade = smoothstep(0.5, 0.3, abs(0.5 - transition));
        vec2 p = o * (mod(l, 5.) + 1.) * depth + offset;
        float s = .08 + (1.0 - transition) * 0.4 * step(1., 1. / abs(mod(l, 40.)));
        float a = mod(atan(p.y, p.x) + iTime * (step(20., l) - 0.5), 3.14);
        float d = length(p) + 0.005 * sin(10. * a + iTime + l);
        O += clamp(fade * pow(.005, 1.0 - 0.2 * (sin(iTime + l) * 0.5 + 0.5)) * transition/abs(d - s)*(cos(l+ length(o) * 3. +vec4(0,1,2,0))+1.), 0.0, 1.0);
       
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}