//By Mikey
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#define iGlobalTime (time+startRandom*1000.)
#define iResolution resolution

uniform vec2 resolution;
uniform float time;
uniform float startRandom;
uniform sampler2D backbuffer;

void mainImage (out vec4, in vec2);

void main( void )
{
 vec2 uv = gl_FragCoord.xy/resolution.xy;

  vec4 fragColor;
  vec2 fragCoord=gl_FragCoord.xy;

  mainImage(fragColor, fragCoord);

 gl_FragColor = fragColor;
}



//#define time iGlobalTime*8.


vec2 map(vec3 p)
{
    float g = 4.0;
  vec3 q = (fract(p/g) * 2.0 - 1.0) * g;
    float m = 0.0;
    float md = 1000.0;
    const int ni = 3;
    for (int i = 0; i < ni; ++i) {
         float f = float(i+1) / float(ni);
        vec3 s = 0.5 - abs(normalize(q));
        q = sign(q) * s;
        float d = length(q) - 0.25;
        if (d < md) {
            md = d;
            m = f;
        }
    }
    float tr = mix(1.0, 4.0, 0.5+0.5*sin(p.z*4.0));
    float cv = pow(length(p.xy), 0.5) - tr;
    md = max(md, -cv);
    return vec2(md, m);
}

vec3 normal(vec3 p)
{
  vec3 o = vec3(0.01, 0.0, 0.0);
    return normalize(vec3(map(p+o.xyy).x - map(p-o.xyy).x,
                          map(p+o.yxy).x - map(p-o.yxy).x,
                          map(p+o.yyx).x - map(p-o.yyx).x));
}

float trace(vec3 o, vec3 r)
{
    float t = 10.0;
    for (int i = 0; i < 32; ++i) {
        vec3 p = o + r * t;
        float d = map(p).x;
        t += d * 0.15;
    }
    return t;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  vec2 uv = fragCoord.xy / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;

    vec3 r = normalize(vec3(uv, 1.0));
    vec3 o = vec3(0.0, 0.0, iGlobalTime);

    float t = trace(o, r);
    vec3 w = o + r * t;
    vec2 fd = map(w);
     vec3 sn = normal(w);

    float prod = max(dot(r, -sn), 0.0);
    float fog = prod * 1.0 / (1.0 + t * t * 0.01 + fd.x * 100.0);

    vec3 sc = vec3(0.25, 0.5, 1.0);
    vec3 ec = vec3(1.0, 1.0, 1.0);
    vec3 fc = mix(sc, ec, fd.y);

    fc *= fog;

  fragColor = vec4(sqrt(fc),1.0);
}