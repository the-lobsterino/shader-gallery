#extension GL_OES_standard_derivatives : enable


precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.1415;

vec2 p = vec2(0.);

void drawCircle(vec2 position, float radius, inout float t){
 t += .002 / (abs(length(p + position) - radius));
}

void drawFlash(vec2 position, inout float t){
 t += .001 / (abs(p.x + position.x) * abs(p.y + position.y)) * (1. - abs(sin(time / 0.1)));
}

float drawLine (vec2 p1, vec2 p2, vec2 uv, float a){
    float r = 0.;
    float one_px = 1./resolution.x ; 
    
    // get dist between points
    float d = distance(p1, p2);
    
    // get dist between current pixel and p1
    float duv = distance(p1, uv);

    //if point is on line, according to dist, it should match current uv 
    r = 1.-floor(1.-(a*one_px)+distance (mix(p1, p2, clamp(duv/d, 0., 1.)),  uv));
        
    return r;
}

void main(){
 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
 vec3 destColor = vec3(p, 0.6);
 float t = 0.;
 
 for(int i_=0; i_<1; i_++){
  for(int i=0; i<20; i++){
   vec3 destColor = vec3(p, 0.5);
   float s = sin(time + (float(i) + float(i_) * sin(time)) * ((PI * 2.) / 15.));
   float c = cos(time + (float(i) + float(i_) * sin(time)) * ((PI * 2.) / 15.));
   
   drawCircle(vec2(c, s)*1.3-mouse+0.5, 2., t);
   drawFlash(vec2(c, s), t);
  }
 }
 t+=drawLine(vec2(0.,resolution.y/2.0)/resolution,vec2(resolution.x,resolution.y/2.0)/resolution,gl_FragCoord.xy/resolution,20.);
 t+=drawLine(vec2(resolution.x/2.0,0.)/resolution,vec2(resolution.x/2.0,resolution.y)/resolution,gl_FragCoord.xy/resolution,10.);
 gl_FragColor = vec4(destColor * t, 5.);
}