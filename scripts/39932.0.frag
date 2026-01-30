#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


const float PI = 3.1415926535897932384626433832795;

mat2 rotate2d(float angle){
    return mat2(cos(angle+time),0.,
                sin(angle+time),0.);
}

float stripes(vec2 st){
    st = rotate2d( PI*-0.202 ) * st *1.;
    return step(.5,1.0-smoothstep(.3,1.,abs(sin(st.x*PI))));
}

void main(){
    vec2 st = gl_FragCoord.xy/resolution.xy * sin(time/6.)*sin(time/6.);
    st.x *= resolution.x/resolution.y/st.y;
   
    vec3 color = stripes(st) * vec3(1.0, 0.75, 0.0);
    gl_FragColor = vec4(color, 1.0);
}