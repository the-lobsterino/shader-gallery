#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float iGlobalTime = time;
vec2 iResolution = resolution;

// LICENSE: CC0
// *-SA-NC considered to be cancerous and non-free

const float PI = 3.14159;

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0;
    uv.x *= iResolution.x/iResolution.y;
    
    float r = length(uv);
    float a = atan(uv.y, uv.x)*190.00;
    a += iGlobalTime*5.0;
    a += cos(r)*10.0*sin(2.*time);
    
    float g = cos(mod(a, PI)*2.0)*0.5 + 0.5;
    
    g = smoothstep(0.0, 0.7, length(r))*g;
    
    gl_FragColor = vec4(sin(g+time),cos(g-time),-sin(2.*g-2.*time) ,1.);
}