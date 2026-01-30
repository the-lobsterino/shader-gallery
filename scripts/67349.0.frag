#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

#define NUM_LAYERS 4.

mat2 rot(float angle){
    float s=sin(angle),c=cos(angle);
    return mat2(c,-s,s,c);
}

float star(vec2 uv,float flare){
    float d=length(uv);
    float m=.04/d;
    float rays=max(0.,1.-abs(uv.x*uv.y*1000.));

    m+=rays*flare;
    uv*=rot(3.1415/4.);
    rays=max(0.,1.-abs(uv.x*uv.y*1000.));
    m+=rays*.3*flare;
    m*=smoothstep(1.,.2,d);
    return m;
}

float hash21(vec2 p){
    p=fract(p*vec2(52.34,5.21));
    p+=dot(p,p+45.32);
    return fract(p.x*p.y);
}
vec3 starlayer(vec2 uv){
    vec3 col=vec3(0);
    vec2 gv=fract(uv)-.5;
    vec2 id=floor(uv);
    for(int y=-1;y<=1;y++){
        for(int x=-1;x<=1;x++){
            vec2 offs=vec2(x,y);
            float n=hash21(id+offs);// random [0,1]
            float size=fract(n*354.32);
            float st=star(gv-offs-vec2(n,fract(n*34.))+.5,smoothstep(.9,1.,size)*.6);
            vec3 color=sin(vec3(1.3392,.2882,.0988))*.8+.5;
            st*=sin(time*3.+n*6.2831)*.5+1.;
            col+=st*size*color;
        }
    }
    return col;
}

void main(){
    vec2 uv=(gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
    float t=time*.05;

    vec3 col=vec3(0);

    for(float i=0.;i<1.;i+=1./NUM_LAYERS){
        float depth=fract(i+t);
        float scale=mix(20.,.5,depth);
        float fade=depth*smoothstep(1.,.9,depth);
        col+=starlayer(uv*rot(t*sin(i*30.))*scale+i*453.2)*fade;
    }

    gl_FragColor=vec4(col,1.);
}