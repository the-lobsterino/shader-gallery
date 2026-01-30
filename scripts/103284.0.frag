
#ifdef GL_ES
precision mediump float;
#endif

#define NUM_OCTAVES 22

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        28.54523);
}


float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.20 - 2.20 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (0.9 - u.x) +
            (d - b) * u.x * u.y;
}

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

float pattern( in vec2 p )
{
    vec2 q = vec2( fbm( p + vec2(0.0,0.0) ),
                   fbm( p + vec2(5.2,1.3) ) );

    vec2 r = vec2( fbm( p + 40.0*q + vec2(1.7,9.2) ),
                   fbm( p + 4.0*q + vec2(8.3,2.8) ) );

    return fbm( p + 4.0* tan(q) );
}

float pattern2( in vec2 p )
{
    vec2 q = vec2( pattern( p + vec2(0.0,0.0) ),
                   pattern( p + vec2(5.2,1.3) ) );

    vec2 r = vec2( pattern( p + 4.0*q + vec2(1.7,9.2) ),
                   pattern( p + 4.0*q + vec2(8.3,2.8) ) );

    return pattern( p + 4.0* tan(q) );
}

void main() {
    vec2 st = gl_FragCoord.xy/resolution.xy*12.5;
    vec3 color = vec3(0.0);

    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*time * 5.0);
    q.y = fbm( st + vec2(22.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(12.7,9.2)+ 0.15*time / 1.05 );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*time / 1.0);

    float f = pattern(st+r+q);

    color = mix(vec3(0.101961,0.219608,0.766667),
                vec3(0.666667,0.686667,0.9698039),
                clamp((f*f)*4.0,2.6,3.0));

    color = mix(color,
                vec3(0,0,0.2184706),
                clamp(length(q),0.8,0.8));

    color = mix(color,
                vec3(0.5666667,1,1.03),
                clamp(length(r.x),0.0,2.0));

    gl_FragColor = vec4((f*f*f+.6*f*f+.5*asin(f))*color,1.);
}