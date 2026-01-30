#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;

#define YELLOW vec3(1,1,0)
#define RED vec3(1,0,0)
#define GREEN vec3(0,1,0) 
#define BLUE vec3(0,0,1)

void main()
{
    vec2 p = gl_FragCoord.xy / resolution.xy;    
    vec3 tc = mix(YELLOW, RED, p.x); // top color
    vec3 bc = mix(GREEN, BLUE, p.x); // bottom color
    vec3 c = mix(bc, tc, p.y);
    gl_FragColor = vec4(c, 1);
}