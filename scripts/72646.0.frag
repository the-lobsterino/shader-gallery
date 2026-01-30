/*
 * Original shader from: https://www.shadertoy.com/view/sdfXW2
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define STEPS 128.0
#define MDIST 150.0
#define pi 3.1415926535
#define rot(a) mat2(cos(a),sin(a),-sin(a),cos(a))
vec3 glow = vec3(0);
vec3 ro = vec3(0);
float sts(float x){ return x-sin(x); }
float rotation (float t){
    float r = sin(t*2.)*sin(t);
    r += t;
    r+=2.0*abs(t*0.2);
    r+=smoothstep(0.0,1.0,sin(t*0.25))*15.0;
    r+=tan(sin(t)*0.4);
    r+=smoothstep(0.5,1.0,sin(t*0.25+2.0))*sin(floor(t*10.0)/10.0);
   
    r -= sts(sts(sts(t*2.0)))*pi/8.;
    return r;
}

float box( vec3 p, vec3 s ){
  vec3 d = abs(p) - s;
  return length(max(d,0.0)) + min(max(d.x,max(d.y,d.z)),0.0);
}
vec3 path(vec3 p){
    return vec3(sin(p.z*0.1)*3.0,cos(p.z*0.1)*2.0,0);
}
float spinBox(vec3 p ,float t){
    float yy = sin(t*2.0)*6.0;
    p.xz*=rot(yy*1.5);
    p.y+= yy;
    float b = box(p-vec3(0,0,0), vec3(0.7));
    return b;

}
vec2 map(vec3 p){
    vec2 a,b;
    float t = mod(iTime,500.0);


    //Tunnel
    a = vec2(length(p.xy-path(p).xy)-6.0, 2.0);
    a.x=-a.x;
    
    vec3 p2 = p;
    p2-=path(p2);
    float modd = 30.0;
    vec3 id = floor((p2)/modd+modd*0.5);
    p2.z = mod(p2.z,modd)-modd*0.5;
    
    p2.y += -5.0;
    
    
    //Top Lights
    b = vec2(box(p2-vec3(0,0,0), vec3(0.1,1.0,0.1)), 3.0);
    glow+=0.18/(0.18+b.x*b.x)*vec3(1.000,0.678,0.243);
    a = (a.x<b.x)?a:b;
    
    //Doors
    b = vec2(box(p2-vec3(0,0,3),vec3(25.0,25.0,0.5)),2.0);
    b.x = max(-length(p2.x)+ro.z-p.z+12.0,b.x);
    a = (a.x<b.x)?a:b;
    

    
    
    p2 = p-path(p);
    id = floor((p2+15.0)/modd+modd*0.5);
    
    //Glow Boxes
    if(mod(id.z,3.0)==0.0){
    p2.z-=20.0;
    p2.z = mod(p2.z,modd)-modd*0.5;
    modd = 10.0;
    b.y = 1.0;
    
    p2.xy*=rot(2.0);
    b.x = spinBox(p2-vec3(0,8,0),t);
    a = (a.x<b.x)?a:b;
    glow+=0.0085/(0.01+b.x*b.x)*vec3(0.980,0.180,0.180);
    p2.z+=5.0;
    p2.xy*=rot(2.0);
    b.x = spinBox(p2-vec3(0,8,0),t+1.0);
    a = (a.x<b.x)?a:b;
    glow+=0.0085/(0.01+b.x*b.x)*vec3(0.306,0.157,1.000);
    p2.z+=5.0;
    p2.xy*=rot(2.0);
    b.x = spinBox(p2-vec3(0,8,0),t+2.0);
    a = (a.x<b.x)?a:b;
    glow+=0.0085/(0.01+b.x*b.x)*vec3(0.157,1.000,0.282);
    }
    
    
    //Glow Spikeys
    if(mod(id.z,3.0)==1.0){
    p2.z-=15.0;
    p2.z = mod(p2.z,modd)-modd*0.5;
    
    vec3 tp2 = p2;
    p2.z-=7.5;
    p2.xy=tp2.xy*rot(rotation(t*1.5));
    b.x = length(p2.xz)-p2.y*0.3+1.0;
    glow+=0.0085/(0.01+b.x*b.x)*vec3(0.980,0.180,0.180);
    a = (a.x<b.x)?a:b;

    p2.z+=7.5;
    p2.xy=tp2.xy*rot(rotation(t*1.5+5.0));
    b.x = length(p2.xz)-p2.y*0.3+1.0;
    glow+=0.0085/(0.01+b.x*b.x)*vec3(0.306,0.157,1.000);
    a = (a.x<b.x)?a:b;
    
    p2.z+=7.5;
    p2.xy=tp2.xy*rot(rotation(t*1.5+10.0));
    b.x = length(p2.xz)-p2.y*0.3+1.0;
    glow+=0.0085/(0.01+b.x*b.x)*vec3(0.157,1.000,0.282);
    a = (a.x<b.x)?a:b;
    

    }
    //Orb Trails
    if(mod(id.z,3.0)==2.0){
    p2.z-=15.0;
    
    p2.z = mod(p2.z,modd)-modd*0.5;
    modd = 2.0;
    
    vec3 tp2 = p2;
    
    p2.xy*=rot(0.5);
    p2.yz*=rot(-0.3);
    p2+=vec3(4,t*3.0,0);    
    p2.y = mod(p2.y,modd)-modd*0.5;
    p2.z-=7.5;
    b.x = length(p2)-0.5;
    glow+=0.0085/(0.01+b.x*b.x)*vec3(0.980,0.180,0.180);
    a = (a.x<b.x)?a:b;
    
    p2 = tp2;
    p2.yx*=rot(1.5);
    p2.yz*=rot(-0.3);
    p2+=vec3(4,t*3.0,0);
    p2.y = mod(p2.y,modd)-modd*0.5;
    b.x = length(p2)-0.5;
    glow+=0.0085/(0.01+b.x*b.x)*vec3(0.306,0.157,1.000);
    a = (a.x<b.x)?a:b;
    
    p2 = tp2;
    p2.yx*=rot(3.5);
    p2.yz*=rot(-0.3);
    p2+=vec3(4,t*3.0,0);
    p2.y = mod(p2.y,modd)-modd*0.5;
    p2.z+=5.5;
    b.x = length(p2)-0.5;
    glow+=0.0085/(0.01+b.x*b.x)*vec3(0.157,1.000,0.282);
    a = (a.x<b.x)?a:b;
    }
    return a;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-0.5*iResolution.xy)/iResolution.y;
    vec3 col = vec3(0);
    float t = mod(iTime,500.0)*5.0+2.0;
    ro = vec3(0,0,t);
    ro+=path(ro);
    
    vec3 look = vec3(0,0,t+4.0);
    look+=path(look);
    vec3 f = normalize(look-ro);
    vec3 r = normalize(cross(vec3(0,1,0),f));
    vec3 rd = f*0.85+uv.x*r+uv.y*cross(f,r);
    
    //vec3 rd = normalize(vec3(uv,1.0));
    
    float dO; 
    vec2 d;
    vec3 p = ro;
    for(float i = 0.0; i<STEPS; i++){
        p = ro+rd*dO;
        d = map(p);
        dO += d.x*0.65;
        if(d.x <0.001||dO>MDIST){
            break;
        }
    }
    if(d.y==3.0)col=vec3(0.961,1.000,0.475);
    col+=glow*0.25;
    col = mix(col,0.5*vec3(1.000,0.886,0.251),dO/(MDIST+50.0));
    col = pow(col,vec3(0.9));
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}