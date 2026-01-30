#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

float iGlobalTime = -time * 0.25;
vec2 iResolution = resolution;

// LICENSE: CC0
// *-SA-NC considered to be cancerous and non-free

const float PI = 3.14159;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main()
{
    vec2 uv = gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0;
    uv.x *= iResolution.x/iResolution.y;
    
    float r = length(uv);
    float a = atan(uv.y, uv.x)*1.0;
    a += iGlobalTime*0.1;
    a += log(r)*5.0;
    
    float g = cos(mod(a, PI)*2.0)*5.0 + 0.5;
    
    if (g < 0.5)
    {
        g = 0.0;
    }
    else
    {
        g = 1.0;
    }
    
    vec4 color = vec4(vec3(g, g, g), 1.0);
    
    float t = iGlobalTime * 0.025;
    vec4 color2 = vec4(hsv2rgb(vec3(t, 0.75, 1.0)), 1.0);
    color = sin(color + color2);
    
    gl_FragColor = color;
}