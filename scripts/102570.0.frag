#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
//________________________________________________
// is this more optimized now, i dont know maybe
//________________________________________________
const float PI = 3.14159265358979323846;

mat3 rotate3D(float angle, vec3 axis, float cosAngle, float sinAngle){
    vec3 a = normalize(axis);
    float r = 1.0 - cosAngle;
    return mat3(
        a.x * a.x * r + cosAngle,
        a.y * a.x * r + a.z * sinAngle,
        a.z * a.x * r - a.y * sinAngle,
        a.x * a.y * r - a.z * sinAngle,
        a.y * a.y * r + cosAngle,
        a.z * a.y * r + a.x * sinAngle,
        a.x * a.z * r + a.y * sinAngle,
        a.y * a.z * r - a.x * sinAngle,
        a.z * a.z * r + cosAngle
    );
}

void twigl(out vec4 o, vec4 FC, vec2 r, float t) {
    o = vec4(0.);
    float e = 0., s, g = 0.;
    o += vec4(1.);
     float sin_t = sin(t);
     float cos_t = cos(t);
    for(int i = 0; i < 100; ++i){
        vec3 q,p=(FC.rgb/r.y-.7)*g;
        e=p.y*.5;
        s=.1;
        for(int j=0;j<7;j++){
     float sin_s = sin(s);
     float cos_s = cos(s);
     mat3 rot = rotate3D(s, p - p + s, cos_s, sin_s);
            q=sin(p*rot*s+t*s)/s,e-=abs(q.x-q.y+q.z)-4.;
            s+=s;
        }
        o+=o.w*min(0.,e)/800.;
        g+=max(e*.2,.1);
    }
    o-=log(g)/35.;
}

void main(void)
{
    twigl(gl_FragColor, gl_FragCoord, resolution, time);
    gl_FragColor.a = 1.;
}