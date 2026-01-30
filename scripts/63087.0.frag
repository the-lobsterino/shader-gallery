/*
 * Original shader from: https://www.shadertoy.com/view/MdK3Rd
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
/*
 * shorter version: FabriceNeyret2 
 */
#define rand(v) fract(sin(dot(v ,vec2(12.9898,78.233))) * 43758.5453)

void mainImage( out vec4 O,  vec2 U )
{
	vec2 R =  iResolution.xy, uv = (2.*U -R)/R.y;
    
    float t = iTime,
          a = atan(uv.x,uv.y)  - t *1.8,
          l = length(uv),
          d = smoothstep(1.,.8,    l)
              - smoothstep(1.,.8, 2.*l);  
          d *= smoothstep(0.,1., fract(a/6.28));
    
    O =  vec4(0,0,.65,1)  + 1.2*d * vec4(.478537, .73621, .478537, 0);

    // vignette & noise from: https://www.shadertoy.com/view/4d3GW7
    O *= 1. - l*l*.155;
    O *= clamp( (rand(uv + sin(t*.1)) * .5 + .5), .9, 1.);
}

/*
 * original version:
#define tau 6.283185307179586
#define pi 0.5*tau
highp float random_2281831123(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = -1. + 2. * fragCoord.xy / iResolution.xy;
    uv.x *= iResolution.x/iResolution.y;
    
    float d0 = smoothstep(0.,0.2, 1.0-2.0*length(uv));
    float d1 = smoothstep(0.,0.2, 1.0-length(uv));
    
    float d = d1 - d0;
    
    float a= atan(uv.x,uv.y) + pi;
    a = a - iTime *1.8;
    a = mod(a, tau);
    
    d = d * smoothstep(0.,tau, a);
    
    vec3 bg = vec3(0.,0.,.65);
    vec3 fg = vec3(0.478537,0.73621,0.478537);
    vec3 c = bg + 1.2 * d * fg;
 
    // vignette & nosie from: https://www.shadertoy.com/view/4d3GW7
    float vignette = 1.0 - max(0.0, dot(uv * 0.155, uv));
    c *= vignette;
    
    float noise = clamp((random_2281831123(uv + sin(iTime * 0.1)) * 0.5 + 0.5),0.90,1.);
    c *= noise;

    fragColor = vec4(c,1.0);
}
*/

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}