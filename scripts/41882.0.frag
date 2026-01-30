precision mediump float;
uniform vec2  resolution;     // resolution (width, height)
uniform vec2  mouse;          // mouse      (0.0 ~ 1.0)
uniform float time;           // time       (1second == 1.0)
uniform sampler2D backbuffer; // previous scene texture

void main(){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y)*100.0;

    float s = sin(time * 0.8);
    float c = cos(time * 0.13);
    vec2 q = mat2(c, -s, s, c) * (p - mod(p-cos(p*time*time*.001)*.1, 1.));

    vec2 v = .4 / mod(q * 5.0, 80.);
    float b = sin(length(v) - time*.001 + q.y / -2. + q.y * .3);
    float y = sin(length(v) - time*.001 + .5 + q.x * -2. + q.y * .3);
    b = pow(b, 1.);
    y = pow(y+b, 1.);
    gl_FragColor = vec4(vec3(0., y * .4 + b * .6, b * .6), 8.);
}
