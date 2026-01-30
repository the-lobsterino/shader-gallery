/*
 * Original shader from: https://www.shadertoy.com/view/wtcSzB
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
//
// Analytic Linear Motion Blur Series:
//
// Self-Intersecting Polygon (XOR Rule) - https://www.shadertoy.com/view/tltXRS
// Concave Polygon - https://www.shadertoy.com/view/tldSzS
// Square - https://www.shadertoy.com/view/wtcSzB
//

vec2 screenToSquareTransform(vec2 p, float t, float i)
{
    float a = t * 2. + cos(t + i) + i / 3.;
    mat2 m = mat2(cos(a), sin(a), -sin(a), cos(a));
    vec2 o = vec2(cos(t * 2. * 2. + i * 5.5) / 2., sin(t * 2.9 * 2. + i * 1.27) * .25);
    o.y += cos(t / 4. + i) * .1;
    return m * (p - o) * (3. + sin(t - i) * 1.5) * 8.;
}

float integrateSquare(vec2 pa, vec2 pb)
{
    vec2 d = pb - pa, sd = sign(d);
    
    vec2 t0 = (-sd - pa) / d;
    vec2 t1 = (+sd - pa) / d;
    
    vec2 i = clamp(vec2(max(t0.x, t0.y), min(t1.x, t1.y)), 0., 1.);
    
    return max(0., i.y - i.x);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - iResolution.xy * .5) / iResolution.y;

    float t = iTime;
    
    vec3 col = vec3(1. / 9.);

  	for(int i = 0; i < 15; ++i)
    {
        vec2 pa = screenToSquareTransform(uv, t, float(i));
        vec2 pb = screenToSquareTransform(uv, t - 1. / 30., float(i));

        float is = integrateSquare(pa, pb);

        col = mix(col, mix(vec3(1, .5, .1), vec3(1), fract(float(i) * 1.629)), is);
    }
    
    fragColor = vec4(pow(col, vec3(1. / 2.2)),1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}