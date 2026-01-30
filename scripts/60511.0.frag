#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
#define PI 3.14159265358979323846

vec2 moveTile(vec2 _pos, float _zoom){
    _pos *= _zoom;
    _pos.x += (step(1.,mod(_pos.y,2.))*2.-1.)*(clamp(mod(time,2.),1.,2.)-1.);
    _pos.y += (step(1.,mod(_pos.x,2.))*2.-1.)*(clamp(mod(time+1.,2.),1.,2.)-1.);
    return fract(_pos);
}

vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

float rect(float x,float y,float w,float h,vec2 pos){
    vec2 bl = step(vec2(x,y),pos); // bottom-left
    vec2 tr = step(vec2(1.-(x+w),1.-(y+h)),1.0-pos);
    float v = bl.x * bl.y * tr.x * tr.y;
    return v;
}

float rectCenter(float x,float y,float w,float h,vec2 pos){
    vec2 bl = step(vec2(x-w/2.,y-h/2.),pos); 
    vec2 tr = step(vec2(1.-(x+w/2.),1.-(y+h/2.)),1.0-pos);
    float v = bl.x * bl.y * tr.x * tr.y;
    return v;
}


void main(){
    vec2  uv = gl_FragCoord.xy/resolution *vec2(resolution.x/resolution.y,1);
    uv = rotate2D(uv,PI*0.25);
    vec2 pos = moveTile(uv,10.);
    pos = rotate2D(pos,clamp(sin(time*PI/4.)*4.,0.,1.)* PI*.5);
	pos = pos * mouse;
    
    //float grid = pos.x > 0.99 && pos.x  <1.|| pos.y >0.99 && pos.y <1. ? 1. : 0.;
    
    float rect1 = rectCenter(.5, 0.5, 1.,  0.1, pos) ;
    float rect2 = rectCenter(.5, 0.5 ,0.1, 1., pos) ; 
    vec3 col = vec3(rect1) * vec3(1.000,0.276,0.025) + vec3(1.-rect1) ;
    col *= vec3(rect2) * vec3(0.047,0.252,0.800) + vec3(1.-rect2) ;
    
    gl_FragColor = vec4(col, 1.0);
}