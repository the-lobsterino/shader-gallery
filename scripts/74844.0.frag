#extension GL_OES_standard_derivatives : enable

precision mediump float;

#define BG vec3(1.000,0.982,0.872)
#define WHITE vec3(1.0)
#define RED vec3(0.765,0.007,0.036)
#define BLUE vec3(0.190,0.524,0.765)
#define YELLOW vec3(0.930,0.818,0.028)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 rec(in vec2 st, in vec4 bounds, in float th, in vec3 color) {
    //outer rec
    float outer = step(bounds.x, st.x) *
    			  (1.0-step(bounds.y, st.x)) *
                  step(bounds.z, st.y) *
                  (1.0-step(bounds.w, st.y));
    //inner rec
    float inner = step(bounds.x+th, st.x) *
    			  (1.0-step(bounds.y-th, st.x)) *
                  step(bounds.z+th, st.y) *
                  (1.0-step(bounds.w-th, st.y));
    return 1.0-outer*(1.0-(inner*color))*vec3(1.0);
}

void main(){
    vec2 st = gl_FragCoord.xy/resolution.xy;
    vec3 color = vec3(0.0,1.0,0.0);
    float th = 0.02;
    vec3 pct = vec3(BG);

    pct *= rec(st, vec4(-0.1,0.2,0.7,1.1), th, RED);
    pct *= rec(st, vec4(0.93,1.1,0.7,1.1), th, YELLOW);
    pct *= rec(st, vec4(0.7,1.1,-0.1,0.15), th, BLUE);
    pct *= rec(st, vec4(-0.1,1.1,0.7,0.89), th, WHITE);
    pct *= rec(st, vec4(-0.1,0.08,0.7,1.1), th, WHITE);
    pct *= rec(st, vec4(0.2-th,0.7+th,-0.1,1.1), th, WHITE);
    pct *= rec(st, vec4(0.7,0.93+th,-0.1,1.1), th, WHITE);
    pct *= rec(st, vec4(0.2-th,1.1,-0.1,0.15), th, WHITE);

    gl_FragColor = vec4(pct,1.440);
}