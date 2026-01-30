#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif


#define PI 3.14159265

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float drawLine (vec3 p1, vec3 p2, vec2 uv, float a) {
    float one_px = 1.0 / resolution.x;
    float d = distance(p1.xy, p2.xy);
    float d_uv = distance(p1.xy, uv);
    float r = 1.0-floor(1.0-(a*one_px)+ distance(mix(p1.xy, p2.xy, clamp(d_uv/d, 0.0, 1.0)), uv));
    return r;
}

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float str = 1.0;
    
    vec3 p1 = vec3(cos(time),1.0,.5) * 0.5 + 0.5;
    vec3 p2 = vec3(.0,sin(time),.5) * 0.5 + 0.5;

    float lines = drawLine(p1, p2, uv, str);
    
	gl_FragColor = vec4(vec3(lines), 1.0);
}