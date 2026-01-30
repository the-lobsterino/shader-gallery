/*
 * Original shader from: https://www.shadertoy.com/view/tttGW2
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
const float ldist = 0.1;
const float llength = 0.5;

float lattice(vec2 q)
{
    float res = 0.;
    float a = atan(q.y, q.x) + .1 * iTime;
    float r = length(q);
    
    q = vec2(r * cos(a), r * sin(a));
    
    for(int i = -3; i <= 3; i++)
    {
        res += smoothstep(0.011, 0.01, abs(q.y - float(i) * ldist));
    }
    res *= smoothstep(llength + .001, llength, abs(q.x));
    return clamp(res, 0., 1.);
}                  




void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from -1 to 1)
    vec2 q = 2.*(fragCoord - 0.5*iResolution.xy)/iResolution.y;

    vec3 col;
    //lattice on the left without AA
    if (q.x < 0.)
    {
        float lat1 = lattice(q - vec2(-.9, 0.));
        col = vec3(1, 1, 1) * lat1;
    }
    else
    //lattice on the right with multisampling AA
    {
        float lat2 = 0.;
        for (int i = -2; i <= 2; i++)
        for (int j = -2; j <= 2; j++)
        {    
            lat2 += lattice(q - vec2(.9, 0.) - float(i + j) / (2. * iResolution.y)) / 25.;
        }
    	col = vec3(1, 1, 1) *lat2;
    }
    
    // middle bar
    col += smoothstep(.031, .03, abs(q.x));
    // Output to screen
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}