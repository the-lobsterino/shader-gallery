#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define R 0.2
#define PI 3.14159



vec3 lightS = vec3(.2,.3,-.4);

mat2 rot(float a){
    float ca=cos(a),sa=sin(a);
    return mat2(ca,-sa,sa,ca);
}

void main( void)
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy/resolution.xx;

    uv -=vec2(.5,0.2);
    vec3 col = vec3(66, 155, 245)/255.;
    float z = -sqrt(R*R-uv.x*uv.x-uv.y*uv.y);
    vec3 p = vec3(uv,z);
    
    vec3 lightdir = normalize(lightS-p);
    vec3 normal = normalize(p);
    float lighting = dot(lightdir,normal);
    //lighting=abs(lighting);
    lighting = clamp(lighting,0.,1.);
    p.xy *= rot(PI/3.);
    p.xz *= rot(PI+time);
    
    vec2 w= vec2(atan(p.y,p.x),acos(p.z/R));
    w -= .6;
    col += abs(w.y-.4*sin(4.*w.x))<0.06?1.:0.;
    // Output to screen
    gl_FragColor = vec4(col*lighting,1.0);
}