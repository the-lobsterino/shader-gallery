/*
 * Original shader from: https://www.shadertoy.com/view/tlyfzt
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
// "un-obfuscated" version of 
// https://twitter.com/zozuar/status/1367243732764876800

mat2 rotate2D(float r){
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}
vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

void mainImage( out vec4 o, in vec2 fragCoord )
{
    o = vec4(0.);
    vec2 r = iResolution.xy;
    float g = 0.;
    float k = iTime * .1; 
    for (float i = 0.; i < 99.; ++i)
    {
        vec3 p = vec3 (g * (fragCoord.xy - .5 * r) / r.y + .5, g - 1.);
        p.xz *= rotate2D (k);
        float s = 3.;
        // fractal levels
        for (int i=0; i < 9;i++)
        {
            float e = max (1., (8. - 8. * cos (k)) / dot (p, p));
            s *= e;
            p = vec3 (2, 4, 2) - abs (abs (p) * e - vec3 (4, 4, 2));
        }
        g += min (length (p.xz), p.y) / s;
        s = log (s);
        o.rgb += hsv (s / 15. + .5, .3, s / 1000.);
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}