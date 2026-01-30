// Original shader from: https://twigl.app/?ol=true&ss=-NSQHneqG30-nbnVq-BS


#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

mat2 rotate2D(float r){
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}

const float s=0.;
void twigl(out vec4 o, vec4 FC, vec2 r, float t) {
    vec3 q=vec3(0),p=vec3(0),d=FC.yzx/r.y-.7;
    q.zy--;
    float l=0.,v=0.;
    for(float i=1.;i<1e2;i++){
        o+=(i>50.?d/=d,log(v+=2e-4)*o:vec4(7,9,1,0)/exp(v*1e4))/4e2;
        p=q-=d*v;
        v=.3;
        p.yz*=rotate2D(1.3);
        for(int j=1;j<5;j++) {
            p=vec3(log2(v*=l=length(p.xy))-p.z/l*.6-t,atan(p.y,p.x)*2.,p.z/l+.3);
            p.xy=fract(p.xy+p.x)-.5;
        }
        v=max(s,p.z*v);
    }
}

void main(void)
{
    twigl(gl_FragColor, gl_FragCoord, resolution, time);
    gl_FragColor.a = 1.;
}