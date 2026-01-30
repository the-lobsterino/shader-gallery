/*
 * Original shader from: https://www.shadertoy.com/view/tdV3Dd
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
float  smin( float a, float b,float k )
{
    float h =  clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 ) ;
    return mix( b, a, h ) - k*h*(1.0-h);
} 


float smax(float a, float b, float k)
{
    return smin(a, b, -k);
}

float fu(vec2 uv) {
    uv.y = max(uv.y, (abs(pow(uv.y, 1.68))));
    float y = fract(uv.y);
    float ym = mod(floor(uv.y), 2.);
    float o = pow(2., floor(uv.y));
    float x = fract(ym + (uv.x * o) + o) - 0.5;
    float p = (1.00  - abs(abs(x*1.0) - smoothstep(0.0, 1.,smoothstep(0.0, 1.,y) ) * 0.25));
    p = mix(p, p * p, smoothstep(0.,1.,y  * 1.11) );
    return smax(
            ( uv.y-6.25)*sqrt(uv.y)*.09,
            smin(uv.y-.9,
                (-p+1.00)*(smoothstep(-.75,.0,1./y))*(smoothstep(0.,.5,1./uv.y))
                -(1./pow(uv.y,1.68)*.3)
                //(float((p + abs(.15 / ((uv.y) - 0.5)))
                
                
                //*mix(1. , 1., smoothstep(0.,1.,y * 1.1) )
                //))
                ,0.1),0.1)
    //*(3./uv.y)
    ;
}
 
vec2 pR(inout vec2 p, float a) {
    return cos(a) * p + sin(a) * vec2(p.y, -p.x);
}
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord / iResolution.x - vec2(0.5, 0.15);
    uv *= (4.8 + sin(iTime*.2) * 3.);
    uv += vec2(sin(iTime * .17) * 2., cos(iTime * .13) * 2.);
    
    float d=fu(vec2(atan(uv.y, uv.x) / 6.28 * ((2.5)),
                0.6 * length(uv) + .65
            )) ; 
    // coloring
    vec3 col = vec3(1.0) - sign(d) * vec3(0.1, 0.4, 0.7);
    col *= 1.0 - exp(-2.0 * abs(d));
    col *= 0.8 + 0.2 * cos(128.0 * abs(d));
    col = mix(col, vec3(1.0), 1.0 - smoothstep(0.0, 0.015, abs(d)));


    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}