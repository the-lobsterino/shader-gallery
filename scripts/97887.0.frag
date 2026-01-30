
precision highp float;


uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 spectrum;


#define iResolution resol()
#define res resolution
#define iTime time
#define iMouse mouse


vec2 resol() {
    return resolution/1.55;
}




mat2 roti(float a) {
    float s=sin(a),c=cos(a);
    return mat2(c,s,-s,c);
}

//---------------------------------------------------------------

float shard, ssoft;


float t,as;

vec3 fractal(vec2 p) {
    p=vec2((atan(p.x,p.y)*3.14),length(p)*.5-1.);
    p+=1.+as*.5;
    p.x=fract(p.x*.1-t*.5+ssoft*.05);
    vec2 m=vec2(1000);
    float ml=100.;
    for (int i=0; i<3; i++) {
        p=abs(p)/clamp(abs(p.x*p.y),.1+floor(mod(time*.2,5.))/10.,.7)-2.;
        m = min(m, abs(p))+fract(p.x*.5+ssoft*3.+time*.4)+fract(p.y*.5+time*.4);
        ml=min(ml,length(p));;
    }
    m=exp(-2.*m);
    vec3 c=vec3(m.x*10.,length(m*3.),m.y*5.);
   // c=c.rgg;
    ml=exp(-7.*ml)*2.;
    c+=ml;
    return c;
}



void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec3 c=vec3(0.);
    float ss=.4+abs(fract(time*.2))*.7;
    as = .5;

    shard = ss*ss*ss;
    ssoft = ss;
    vec2 uv = -1. + 2. * fragCoord.xy/iResolution.xy;
    t=time*.3;
    float s=sin(time/4.);
    uv+=vec2(sin(t),cos(t))*.3;
    uv*=1.3+tan(ss*4.)*.1;
    //uv.x*=1./pow(abs(s), .6)*sign(s);
    uv.x*=iResolution.x/iResolution.y;
    //uv=uv.yx;
 //   uv*=.7;
    //t*=.5+floor(length(uv)*6)*.1;
    t+=smoothstep(.0,.2,fract(length(uv*.5)-time*.5));
 //   uv*=1.+exp(-3*length(uv))*spectrum.x*100;
    //uv=abs(.5-fract(uv));
    c+=fractal(uv);
    c+=max(0.,1.1-length(uv)*shard*5.);
    //c=mix(c,texture(prevFrame,gl_FragCoord.xy/resolution).rgb,.8);
    //c*=step(length(uv),3.);
    //c*=mod(length(uv),.5)*5.;
    fragColor = vec4(c, 1.0);//*mod(gl_FragCoord.y,10.)*.1;
}




//---------------------------------------------------------------



void main(void)
{
    vec2 uv = gl_FragCoord.xy/resolution.xy-.5;
    float ap=resolution.x/resolution.y;
    ap=1.;
    uv.x*=ap;
    uv*=1.55;
    uv+=vec2(-.07,.17);
    vec3 col=vec3(0.);
    vec4 fragColor=vec4(0);
    if ((uv.x<.5*ap&&uv.x>-.5*ap&&uv.y<.5&&uv.y>-.5)) {
        mainImage(fragColor,(uv+=.5)*iResolution);       
        col = fragColor.rgb;
    } else {
        uv*=.02;
        mainImage(fragColor,(uv+=.5)*iResolution);       
        col = fragColor.rgb;
        
    }
    gl_FragColor = vec4(col,1);
}