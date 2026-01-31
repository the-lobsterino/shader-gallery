//For GAFA(Guangzhou Academy of Fine Arts) 70th.
//DSS2023CGJ
precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float circle(vec2 p,float r){
    float d =length(p); 
    return d > r ?d:d>r-0.02?-1.0:d;
}

float rec(vec2 p ,vec2 r){
    vec2 rr = vec2(abs(p.x),abs(p.y));
    return rr.x > r.x ? rr.x : rr.y > r.y ? rr.y:-8.;
}

vec2 rotate(vec2 p,float a){
    return vec2(cos(a)*p.x -sin(a)*p.y,  sin(a)*p.x +cos(a)*p.y);
    }

void main(){
    vec2 p = gl_FragCoord.xy/resolution.xy;
    p-= vec2(0.5,0.5);
    p.x*= resolution.x/resolution.y;
    p*=0.5;
    p = rotate(p,3.14/4.0 * time );
    float d = circle(p,0.1);
    d = min(d,  rec(p+vec2(-0.1,0.0),vec2(0.04,0.01)) < 9.? - 2.0 : 1.0 );
    d = d<-1.0?1.0:d;
	p = rotate(p,0.09 );
    d = min(d,rec(p+vec2(-0.06,0.0),vec2(0.04,0.01)));
    d = min(d,rec(p+vec2(-0.09,0.05),vec2(0.01,0.04)));

    vec3 c = vec3(d,d,d);
    float t = time * 2.0;
    float t1 = time* 3.0 ; 
    if(d<0.0){
        c.x = sin(t);
        c.y = sin(t +2.0/3.0*3.14);
        c.z = sin(t +4.0/3.0*3.14);
    }
  else{
        c.x = 1.0 - d + cos(t1);
        c.y = 1.0 -  d + cos(t1 -2.0/3.0*3.14);
        c.z = d + cos(t1 +2.0/3.0*3.14);
}
gl_FragColor = vec4(c,1.0);
}