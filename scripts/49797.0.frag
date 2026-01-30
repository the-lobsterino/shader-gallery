#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float random (vec2 st) {
    return fract(43758.5453123*sin(dot(st.xy,vec2(12.9898,78.233))));
}

float numy = 10.0;
float numx = 25.0;
float speed = 0.5;
void main() {
    vec2 uv = gl_FragCoord.xy/resolution;
    vec2 st = uv;
    vec2 i;
    
    float dir = float(fract(st.y*numy)<.5);
    dir = (dir-.5)*2.0;
    st.x = st.x+dir*time*random(vec2(floor(time*speed), floor(st.y*numy)));
    
    i.x = floor(st.x*numx);
    i.y = floor(st.y*numy);
    vec3 color = vec3(step(.5,random(i)));
    gl_FragColor = vec4(color,1.0);
}