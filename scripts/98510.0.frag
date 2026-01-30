precision mediump float;

#define SQRT_3   1.732050808
#define SQRT_3_2 0.866025404
#define SQRT_3_3 0.577350269
#define OFFSET vec2(1.5, SQRT_3_2)

uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

// SDF by iq
float sdHexagon( in vec2 p, in float r )
{
    const vec3 k = vec3(-SQRT_3_2, 0.5, SQRT_3_3);
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p)*sign(p.y);
}

void main()
{
    float tt=min(3.,3.+2.*sin(time/4.));
    vec2 p = (gl_FragCoord.xy/resolution*2.0-6.0)*vec2(resolution.x/resolution.y, 1.0) * 10.0*tt;
    float e = 0.1;

#if 0
    float s = mouse.x;
    float t = mouse.y;
#else
    float s = 0.8;
    float t = 0.6;
#endif
    float m=1.5+sin(length(p)/4./tt-time*2.);
    float c = e/abs(sdHexagon(s*(mod(p,        OFFSET*2.0*m) - OFFSET*m), t))
            + e/abs(sdHexagon(s*(mod(p-OFFSET*m, OFFSET*2.0*m) - OFFSET*m), t));

    gl_FragColor = vec4(vec3(0.1, 0.2, 1.0)*c, 1.0);
}
