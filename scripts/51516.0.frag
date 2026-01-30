#ifdef GL_ES
  precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
//uniform vec2 mouse;

float iGlobalTime = time; 

float raysCount = 8.0;
vec3 color0 = vec3(0.2, 0.5, 1.0);
vec3 color1 = vec3(0.7, 0.8, 1.0);

void main()
{
    float smoothness = 0.5;
    //float smoothness = (1.0 + sin(iGlobalTime * 2.0)) * 0.5;
    
    vec2 p = (-resolution.xy + 2.0 * gl_FragCoord.xy) / resolution.y;

    // background
    vec2 q = vec2(atan(p.y, p.x), length(p));
    //float f = smoothstep(-smoothness, smoothness, sin(q.x * raysCount + iGlobalTime * 10.0));
    float f = sin(q.x * raysCount + iGlobalTime * 15.0);
    vec3 col = mix(color0, color1, f);
    gl_FragColor = vec4(col, 1.0);

}