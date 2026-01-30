#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform sampler2D u_image;

float time=u_time/2.0;
vec2 res=u_resolution;

vec2 random2(vec2 st){
    st=vec2(dot(st,vec2(127.1,311.7)),
    dot(st,vec2(269.5,183.3)));
    return-1.+2.*fract(sin(st)*43758.5453123);
}

// Value Noise
float noise(vec2 st){
    vec2 i=floor(st);
    vec2 f=fract(st);
    
    vec2 u=f*f*(3.-2.*f);
    
    return mix(mix(dot(random2(i+vec2(0.,0.)),f-vec2(0.,0.)),
    dot(random2(i+vec2(1.,0.)),f-vec2(1.,0.)),u.x),
    mix(dot(random2(i+vec2(0.,1.)),f-vec2(0.,1.)),
    dot(random2(i+vec2(1.,1.)),f-vec2(1.,1.)),u.x),u.y);
}

float noise1d(float v){
    return cos(v + cos(v * 90.1415) * 100.1415);
}

float metaball(in vec2 pos,in vec2 center,in float radius){
    float d=distance(pos,center)+.001;
    return radius/d;
}

float circle(vec2 st,vec2 center,float radius){
    return smoothstep(1.,1.-.025,distance(st,center)/radius);
}

float ring(vec2 st,vec2 center,float radius,float width){
    return circle(st,center,radius)-circle(st,center,radius-width);
}

mat2 rotate(float angle){
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main(){
    vec3 white=vec3(1.);
    // vec3 red=vec3(1.,0.,0.);
    vec3 black = vec3(0.0);
    vec3 blue = vec3(0.5529,0.8078,0.8549);
    vec3 orange = vec3(0.7882,0.5333, 0.4549);

    vec3 color=vec3(0.);
    vec3 metaColor = vec3(0.0);
    vec3 metaColor2 = vec3(0.0);
    vec3 circle=vec3(0.);


    vec2 p=(gl_FragCoord.xy*2.-res)/min(res.x,res.y);
    vec2 center=vec2(0.);
    
    float angle=2.*PI/5.;
    p *= rotate(angle/(-4.0));
    float orbAngle = angle; // orbital angle.
    
    // float iPR=.6;// set inner Position Circle's Radius
    // float oPR=.75;// set outer Position Cirlce's Radius
    float iPR[5];
    float oPR[5];
    float iPR2[5];
    float oPR2[5];

    // blue
    iPR[0] = .6;
    iPR[1] = .45;
    iPR[2] = .55;
    iPR[3] = .75;
    iPR[4] = .65;

    // orange
    iPR2[0] = .45;
    iPR2[1] = .5;
    iPR2[2] = .4;
    iPR2[3] = .65;
    iPR2[4] = .7;

    for(int i = 0; i<5; i++) {
        oPR[i] = iPR[i] + 0.15;
        oPR2[i] = iPR2[i] + 0.15;
    }

    float mR=.5;// set Main Circle's Radius
    float iR=.06;// set innner Circles' Radius
    float oR=.02;// set outer Circles' Radius
    float iOrbR = .05; // orbital radius
    float oOrbR = 0.07;
    vec2 mCenter=center;
    metaColor+=vec3(metaball(p,mCenter,mR));
    metaColor2+=vec3(metaball(p,mCenter,mR));
    circle+=vec3(ring(p,mCenter,mR,.01));
    for(int i=0;i<5;i++){
        vec2 iCenter=iPR[i]*vec2(cos(angle*(float(i)+1.)),sin(angle*(float(i)+1.)));
        vec2 oCenter=oPR[i]*vec2(cos(angle*(float(i)+1.)),sin(angle*(float(i)+1.)));
        iOrbR += noise1d(float(i)) * 0.02;
        oOrbR += noise1d(float(i)) * 0.01;
        iCenter+= iOrbR*vec2(cos(time+float(i)), sin(time+float(i)));
        oCenter += oOrbR*vec2(cos(time+float(i)), sin(time+float(i)));
        metaColor+=vec3(metaball(p,iCenter,iR));
        metaColor+=vec3(metaball(p,oCenter,oR));
    }

    p*=rotate(angle/2.0);
    for(int i=0;i<5;i++){
        vec2 iCenter=iPR2[i]*vec2(cos(angle*(float(i)+1.)),sin(angle*(float(i)+1.)));
        vec2 oCenter=oPR2[i]*vec2(cos(angle*(float(i)+1.)),sin(angle*(float(i)+1.)));
        iOrbR += noise1d(float(i)) * 0.02;
        oOrbR += noise1d(float(i)) * 0.01;
        iCenter+= iOrbR*vec2(cos(time+float(i)), sin(time+float(i)));
        oCenter += oOrbR*vec2(cos(time+float(i)), sin(time+float(i)));
        metaColor2+=vec3(metaball(p,iCenter,iR));
        metaColor2+=vec3(metaball(p,oCenter,oR));
        circle+=vec3(ring(p,iCenter,iR,.01));
        circle+=vec3(ring(p,oCenter,oR,.01));
    }
    
    float threshold=1.35;
    if(metaColor.r>threshold){
        metaColor=vec3(1.0);
        metaColor *= blue;
    } else {
        metaColor = black;
    }

    if(metaColor2.r>threshold){
        metaColor2=vec3(1.0);
        metaColor2 *= orange;
    } else {
        metaColor2 = black;
    }
    

    if((metaColor.r+metaColor2.r) > 1.0) {
        metaColor *= 0.;
        metaColor2 *= 0.65;
    }
    circle*=white;
    color+= metaColor + metaColor2;
    // color += circle;
    
    gl_FragColor=vec4(color,1.);
}