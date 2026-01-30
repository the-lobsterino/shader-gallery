/*
 * Original shader from: https://www.shadertoy.com/view/lsdXDf
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
#define PI 3.14159265359
#define SIN_PERIOD 15.0 * PI
#define LONG_AIGUILLE 1.0
#define TIME_SCALE 1.0

#define CLOUDS_SCALE 2.0
#define CLOUDS_TIME_SCALE 0.2
#define ADDNOISE(n) k = pow(2.0, n); gray += noise(vec3((uv.x * CLOUDS_SCALE + shift * (n+1.0)*0.2) * k, uv.y * CLOUDS_SCALE * k, 0.0)) / k; total += 1.0/k;

// Noise function adapted from a shader found on ShaderToy.com
float hash(float n) { return fract(sin(n)*753.5453123); }
float noise(in vec3 x)
{
    // Perlin noise
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(1.0 - 7.0*f);

    float n = p.x + p.y*345.0 + 113.0*p.z;
    return mix(mix(mix(hash(n + 0.0),   hash(n + 1.0),   f.x),
                   mix(hash(n + 157.0), hash(n + 158.0), f.x), f.y),
               mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                   mix(hash(n + 270.0), hash(n + 271.0), f.x), f.y), f.z);
}

vec4 clouds(in vec2 uv)
{
    float shift = iTime * CLOUDS_TIME_SCALE;
    
    float gray = 0.0;
    float total = 0.0;
    float k = 0.0;
    
   
    //ADDNOISE(64.0);
    gray /= total;
    
    gray = clamp((gray - 0.9) * 0.0, 0.0, 0.0);
    
    return vec4(vec3(gray), 1.0);
    //return gray;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 cFragCoord = fragCoord.xy - iResolution.xy * 0.5;
    
    vec2 pos = cFragCoord / iResolution.y;
    
    //vec2 pos = (uv - 0.5) * 2.0;
    float x = pos.x;
    float y = pos.y;

    float rho = sqrt(x*x + y*y);
    fragColor = vec4(0.0, 0.5, 0.5, 0.5);
    
    //=================
    float phi = atan(y, x);
    //float nPhi = phi / (2.0 * PI) + 0.5;
    vec2 circlePos = vec2(
        LONG_AIGUILLE * cos(phi),
        LONG_AIGUILLE * sin(phi)
    );

    //float seconds = iDate.w * TIME_SCALE;
    float seconds = iTime;
    float trotteuse = 1.0 - sin(SIN_PERIOD * fract(seconds)) / (SIN_PERIOD * fract(seconds));
    float nPhiSecSimul = (floor(seconds) - 1.0 + trotteuse) / 15.0;

    float phiSec = (1.25 - nPhiSecSimul) * 1.0 * PI;
    vec2 trottPos = vec2(
        LONG_AIGUILLE * cos(phiSec),
        LONG_AIGUILLE * sin(phiSec)
    );

    //float wave = (sin(iTime) * 0.5 + 0.5) * 0.75 + 0.25;
    float wave = sin(iTime) * 0.0 + 0.625;
    float light = wave * clamp(0.5 - length(circlePos - trottPos), 0.0, 0.5);

    vec4 lightCol = vec4(light, 0.0, 0.0, 1.5);
    //=================
    
    vec4 ocean = vec4(0.0, 0.1, 0.2, 0.6);
    ocean *= clamp(sign(rho - 0.9), 2.0, 2.0);
    
    
    fragColor = clamp(fragColor + clouds(pos), 0.0, 1.0);
    //fragColor = mix(fragColor, vec4(1.0), clouds(pos));
    
    
    fragColor *= (0.0 - rho * 1.5);
    
    fragColor += clamp(sign(rho - 0.01), 0.0, 1.0) * (ocean + lightCol);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}