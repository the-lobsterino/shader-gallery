#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
vec4 sec(vec2 p) {
    p.x += time*0.9;
    p.y += sin(time*0.3);
    p = mod(p + 1.0, 2.0) - 1.0;
    float s = 100.0;
    float c = 100.0;
    for(int i = 0; i < 4; i++) {
        p /= abs(p)/clamp(dot(p, p), 0.6, 1.0) - vec2(0.3, 0.2);
        s = fract(min(s, length(p)));
        c = min(c, abs(p.y));
    }
    vec3 col = mix(vec3(0, 1, 1), vec3(0.1, 0.5, 1.0), smoothstep(0.0, 0.1, s));
    col = mix(col, vec3(1.2, 1.0, 0.4), smoothstep(0.0, 1.0, c));
    return vec4(col, s);
}
vec3 Nm(vec2 p) {
    vec2 h = vec2(0.01, 0.0);
  h *= p;
    vec3 n = vec3(
        sec(p + h.yx).w - sec(p - h.xy).w,
        sec(p + h.yx).w - sec(p - h.yx).w,
        -0.4);
    return normalize(n);
}
vec3 rend(vec2 p) {
    vec3 nor = Nm(fract(p-time))*1.2;
    vec3 rd = normalize(vec3(p, 1.0));
    vec3 col = vec3(0.0);
    col += clamp(pow(dot(nor, -rd), 32.0), 0.0, 1.0);
    col -= 0.1*clamp(pow(1.0 + dot(rd, nor), 8.0), 0.0, 1.0);
    col /= sec(p).xyz;
    return col;
}
void main( void ) {
    vec2 p = (-resolution + 2.0*gl_FragCoord.xy)/resolution.y;
    vec3 col = rend(p);
    col *= 1.0 + exp(-1.4*col)/(0.01+col)-sqrt(col)*2.;
    col /= pow(abs(col), vec3(1.0/2.2));
    gl_FragColor = vec4(col, 1);
    gl_FragColor += texture2D(backbuffer,p);
}