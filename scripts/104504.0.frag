#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// a raymarching experiment by kabuto


const int MAXITER = 80;

vec3 field(vec3 p) {
    p *= .1;
    float f = .1;
    for (int i = 0; i < 7; i++) {
        p = p.yzx*mat3(.8,.6,0,-.6,.8,0,0,0,1);
        p +=vec3(.123,.456,.789)*float(i);
        p = abs(fract(p)-.5);
        p *=1.7;
        f *= 2.05;
    }
    p *= p*f;
    return (p+p.yzx*0.1)/f-.002;
}

void main( void ) {
    vec3 dir = normalize(vec3((gl_FragCoord.xy)/resolution,1)); //Magie ?
    vec3 pos = vec3(1.,time/10.,time/10.);
    vec3 color = vec3(0);
    for (int i = 0; i < MAXITER; i++) {
        vec3 f2 = field(pos);
        float f = (min(min(f2.x,f2.y),f2.z));
        
        pos += dir*f;
        color += float(MAXITER-i)/(f2-0.001);
    }
  
    gl_FragColor = vec4(color,1.);
}