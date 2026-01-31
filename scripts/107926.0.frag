#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const int _SnowflakeAmount = 200;
const float _BlizardFactor = 0.2;
vec2 uv;

float rnd(float x)
{
    return fract(sin(dot(vec2(x+47.49,38.2467/(x+2.3)), vec2(12.9898, 78.233)))* (43758.5453));
}

float drawCircle(vec2 center, float radius)
{
    return 1.0 - smoothstep(0.0, radius, length(uv - center));
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    uv = (gl_FragCoord.xy - resolution.xy) / resolution.y;
    
    fragColor = vec4(0.808, 0.89, 0.918, 1.0);
    float j;
    
    for(int i=0; i<_SnowflakeAmount; i++)
    {
        j = float(i);
        float speed = 0.3+rnd(cos(j))*(0.7+0.5*cos(j/(float(_SnowflakeAmount)*0.25)));
        vec2 center = vec2((0.25-uv.y)*_BlizardFactor+rnd(j)+0.1*cos(time+sin(j)), mod(sin(j)-speed*(time*1.5*(0.1+_BlizardFactor)), 0.65));
        fragColor += vec4(0.09*drawCircle(center, 0.001+speed*0.012));
    }
}