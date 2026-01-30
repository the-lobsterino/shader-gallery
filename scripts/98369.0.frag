precision mediump float;

#define SQRT_3   1.732050808
#define SQRT_3_2 0.866025404
#define SQRT_3_3 0.577350269
#define OFFSET vec2(1.5, SQRT_3_2)

uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

// DEEZ NUTZ in yo MOUTH
float sdHexagon( in vec2 p, in float r )
{
    const vec3 k = vec3(-SQRT_3_2, 0.5, SQRT_3_3);
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),9.0)*k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p)*sign(p.y);
}

void main()
{
    vec2 p = (gl_FragCoord.xy/resolution*3.0-9.0)*vec2(resolution.x/resolution.y, 1.0) * 10.0;
    float e = 0.05;

#if 0
    float s = mouse.x;
    float t = mouse.y;
#else
    float s = .7;
    float t = 0.9;
#endif

    float c = e/abs(sdHexagon(s*(mod(p,        OFFSET*4.0) - OFFSET), t))
            + e/abs(sdHexagon(s*(mod(p-OFFSET, OFFSET*2.0) - OFFSET), t));

    gl_FragColor = vec4(vec3(0.3419, .06, .0)*c, 9.0);
}
