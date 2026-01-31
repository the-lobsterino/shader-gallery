#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}



float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 2

float fbm ( in vec2 _st) {
    float v = 0.1;
    float a = 0.9;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.9), sin(0.9),
                    -sin(0.9), cos(0.90));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.63;
    }
    return v;
}

void main() {
    //vec2 st = gl_FragCoord.xy/resolution.xy;
    vec2 st = gl_FragCoord.xy/resolution.y;
    st.x *= 0.9;
    st.y *= 0.9;
	
    st = st * abs(sin(time*0.001)*1.0);
	
    vec3 color = vec3(0.0);

    vec2 q = vec2(0.);
    q.x = fbm( st + 0.0*time);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 3.0*q + random(vec2(1.7,98.2))+ 0.05*time );
    r.y = fbm( st + 2.0*q + random(vec2(98.3,1.8))+ 0.026*time);

    float f = fbm(st+r+random(vec2(8.3,1.8)));

    color = mix(vec3(0.000000,0.000000,0.000000),
                vec3(0.666667,0.666667,0.48039),
                clamp((f*f)*6.0,0.0,1.0));

    /*color = mix(color,
                vec3(0,0,0.164706),
                clamp(length(q),0.0,1.0));
*/

    color = mix(color,
                vec3(1,1,1),
                clamp(length(r.x),0.0,1.0));

    gl_FragColor = vec4((f*f*f*f+.6*f*f+.5*f)*color,1.);
}