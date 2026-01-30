#ifdef GL_ES
precision mediump float;
#endif


uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float SPEED = .6;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {
    vec2 st = (.5+mouse.y)*gl_FragCoord.xy/resolution.xy;
    float direction = step(0.5, st.y) * 2. - 1.;
    st *= mat2(4., 0., 0., 8.);
    vec2 ipos = floor(st);
    vec2 fpos = fract(st);

    float speed = random(vec2(ipos.y)) + 1.;

    st.x += mouse.x*direction * speed * time * SPEED;

    ipos = floor(st);
    fpos = fract(st);

	vec3 color = vec3(random(ipos.rr), random(ipos.gg), random(ipos.gr));

	color *= 
        step(0.1, fpos.x) * 
        step(0.1, fpos.y) * 
        step(0.1, 1. - fpos.x) * 
        step(0.1, 1. - fpos.y) * 
        vec3(step(0.5,random( ipos )));

    gl_FragColor = vec4(color,1.0);
}