precision mediump float;

#define BLACK vec3(0.0, 0.0, 0.0)
#define GREEN vec3(0.2, 0.4, 0.3)
float insideBox(vec2 v, vec2 bottomLeft, vec2 topRight, vec2 smoothv) {
        vec2 s = smoothstep(bottomLeft - smoothv * 0.5, bottomLeft + smoothv * 0.5, v) - smoothstep(topRight - smoothv * 0.5, topRight + smoothv * 0.5, v);
        return s.x * s.y;
    }
void main() {
    vec2 uv = floor(gl_FragCoord.xy / 20.0);
    vec4 color;
    bool isEven = mod(uv.x + uv.y, 2.0) == 0.0;
    if(isEven) {
        color = vec4(BLACK, 1.0);
    }
    else {
        color = vec4(GREEN, 1.0);
    }
    gl_FragColor = color;
}
