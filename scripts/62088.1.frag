#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float gear(in vec2 st, in vec2 origin){
    vec2 pos = origin-st;
    pos = pos * 2.;
    float r = length(pos)*2.0;
    float a = atan(pos.y,pos.x);
    float f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;
    return 1.-smoothstep(f,f+0.02,r);
}
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}
vec2 rotatedWRT(in vec2 st, vec2 origin, float _angle){
    st -= origin;
    st = rotate2d(_angle) * st;
    st += origin;
    return st;
}
float hypno(in vec2 st, in vec2 origin){
    float pct = cos(distance(st,origin)*100.-time*15.);
    return pct;
}

void main(){
    vec2 st = gl_FragCoord.xy/resolution.y;
    st.x -= resolution.y/resolution.x;
    vec2 origin1 = vec2(0.5);
    vec2 origin2 = vec2(0.550,0.810);
    vec2 origin3 = vec2(0.640,0.220);
    float gear1 = gear(rotatedWRT(st,origin1,-time),origin1);
    float gear2 = gear(rotatedWRT(st,origin2,time),origin2);
    float gear3 = gear(rotatedWRT(st,origin3,time),origin3);

    gl_FragColor = vec4(vec3(hypno(st,origin1)*gear1+hypno(st,origin2)*gear2+hypno(st,origin3)*gear3), 1.0);
}