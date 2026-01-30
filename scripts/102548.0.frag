// Original shader from: https://twitter.com/zozuar/status/1532780755671207938

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

mat2 rotate2D(float r){
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

void twigl(out vec4 o, vec4 FC, vec2 r, float t) {
    o=vec4(0);
    float e=0.,g=0.,v=0.,u;
    for(float i=0.;i<90.;i++){
        vec3 p=vec3((.5*r-FC.xy)/r.y*g,g)-.3;
        e=v=5.;
        for(int j=0;j<9;j++){
            p.xz*=rotate2D(t*.2),v/=u=dot(p,p)/.75,p/=u,p.y=-p.y,e=min(e,(length(p.xz)+p.y*.1)/v-.001*u/v);
            p=abs(p)-1.;
        }
        g+=e;
        o.rgb+=.01-hsv(0.7-log(v)*.05,.4,.015)/exp(e*400.);
    }
}

void main(void)
{
    twigl(gl_FragColor, gl_FragCoord, resolution, time);
    gl_FragColor.a = 1.;
}