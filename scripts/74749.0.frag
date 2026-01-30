/*
 * Original shader from: https://www.shadertoy.com/view/7dtGW2
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
const float eps = 0.001;
vec2 eps2 = vec2(eps);

vec3 color(vec2 p) {
    float x = atan(p.y,p.x)/4.-.57;
    float y = mod(iTime*.2+.5/sqrt(length(p))-1.2, 1.);

    float bail=100.;
    vec2 a = vec2(x,y);
    vec3 col = vec3(0.);
    for (int i=0; i < 75; i++)
    {
        a += vec2(a.x*a.x-a.y*a.y,a.x*a.y*2.)+vec2(.123, .134);
        float af = clamp(0., 1., length(a));
        vec2 ac = normalize(a);
        col = 1.*vec3(.55*ac.x+0.2*ac.y+0.3*p.x, .47*ac.y, af);
        col += vec3(1.-length(p));
        col = mix(vec3(1.), sqrt(col), length(p)*3.);
        if (length(a) > bail)
        {
            break;
        }
    }
    
    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = (fragCoord.xy-.5*iResolution.xy) / iResolution.y;
    
    vec3 col = (color(p) + 
                color(p+eps2))/2.;
                
    col = pow(col-.0, vec3(8.));
                
	fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}