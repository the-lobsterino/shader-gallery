#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
const float scale = 1.0;
const vec4 cbr = vec4(100.0/255.0,  87.0/255.0,  66.0/255.0, 255.0/255.0);

void main( void ) {
    vec4 cb = vec4(0.0, 0.0, 0.0, 1.0) * 0.58;
    vec4 cw = vec4(1.0, 1.0, 1.0, 1.0) * 0.5;
    vec4 ca = vec4(1.0, 1.0, 1.0, 1.0) * 0.0;
    vec4 cy = vec4(1.0, 0.89, 0.0, 1.0) * 0.5;

    vec2 m = vec2(100.0, 300.0);
	
    vec2 p = gl_FragCoord.xy;
    p.y -= resolution.y / 2.0;

    float d = distance(m, p);

    float ld = 1000.0 * scale;
    vec4 mixes = clamp(vec4((d - 0.0 * ld) / (0.1 * ld),
                            (d - 0.1 * ld) / (0.7 * ld),
                            (d - 0.8 * ld) / (0.2 * ld),
                            0.0),
                       vec4(0.0),
                       vec4(1.0));
    vec4 g1 = mix(cw, cy, mixes.x);
    vec4 g2 = mix(g1, ca, mixes.y);
    vec4 g3 = mix(g2, cb, mixes.z);
	
    float angle1 = 1.2;
    float angle2 = 2.4;

    float dx = p.x;
    float y1a = angle1 * dx + angle1 * -m.x + m.y;
    float y1b = angle2 * dx + angle2 * -m.x + m.y;
    float y2a = -angle1 * dx + -angle1 * -m.x + m.y;
    float y2b = -angle2 * dx + -angle2 * -m.x + m.y;
	
    vec4 cl = clamp(vec4((p.y - y1a) / d,
                         (p.y - y1b) / d,
                         (y2a - p.y) / d,
                         (y2b - p.y) / d),
                    vec4(0.0),
                    vec4(1.0));
    vec4 x1 = mix(g3, cb, cl.x);
    vec4 x2 = mix(x1, cb, cl.y);
    vec4 x3 = mix(x2, cb, cl.z);
    vec4 x4 = mix(x3, cb, cl.w);

    gl_FragColor = x4;
}
