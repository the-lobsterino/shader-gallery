#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define miter 200
#define citer 100

float lm(float a, float r)
{
    return r*a*(1.0-a);
}

void main()
{
    vec2 uv = gl_FragCoord.xy/resolution;
    float f = 1.0/0.0;
    for (int i=0; i<citer; ++i)
    {
        float a = float(i)/float(citer);
        for (int j=0; j<miter; ++j)
            a = lm(a, uv.x*4.0);
        f = min(f, abs(a-uv.y));
    }
    
    gl_FragColor = vec4( vec3(1.0-smoothstep(f, 0.0, 0.001)), 1.0 );
}