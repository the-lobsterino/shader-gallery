/*
 * Original shader from: https://www.shadertoy.com/view/cdKSWV
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
const float gStep = .0;
#define ENTROPY
vec4 hash42(vec2 p)
{
	vec4 p4 = fract(vec4(p.xyxy) * vec4(.1031, .1030, .0973, .1099));
    p4 += dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}


void mainImage( out vec4 o, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    vec2 uvo = uv-.5;
    uv.x *= iResolution.x / iResolution.y;
    o = vec4(0);
    float t = iTime;
    uv += (t+sin(t*vec2(1.,1.2)))*vec2(.1,.15);
    uv *= 4.;
   
    vec2 id = floor(uv);
    vec2 p = uv-id;
    vec4 gh = hash42(id);
    
    for (float i = 0.;i<1.;i += gStep)
    {
        id = floor(uv);
        p = uv-id;
        vec4 h = hash42(id);
        vec2 p2 = abs(p-.5)-1./6.; // triangle edges
        #ifdef ENTROPY
        p2 += (sin(iTime*gh.x))*.1;
        uv += p2.yx*mix(.3,1.,gh.z); // essentially sharpness of pattern
        #else
        uv += p2.yx; // essentially sharpness of pattern
        #endif
        o += h;
    }
    
    o /= 15.;
    o.rgb = mix(o.rgb,vec3(o.r+o.g+o.b)/3.,.5);
    o *= 1.-dot(uvo,1.5*uvo);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}