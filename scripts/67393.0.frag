/*
 * Original shader from: https://www.shadertoy.com/view/wl2fzR
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
#define res iResolution.xy
#define s smoothstep
#define t iTime
#define pi 3.1415

mat2 rot(float a){
    float s=sin(a), c=cos(a);
    return mat2(c,-s,s,c);
}

float A(vec2 st){
    float curve = .35;
    float a = step(st.x+st.y*curve,.0)*step(.0,st.x-st.y*curve)*step(.15,-st.y)*step(-st.y,.75);
    a *= 1.-step(.15,st.x-st.y*curve)*step(.15,-st.x-st.y*curve)*step(.7,-st.y);
    a *= 1.-step(.15,st.x-st.y*curve)*step(.15,-st.x-st.y*curve)*step(-.6,st.y);
    return a;
}

float W(vec2 st){
    float curve = .35;
    float w = step(.0,st.x+st.y*curve)*step(st.x-st.y*curve,1.)*step(.15,-st.y)*step(-st.y,.75);
    w *= 1.-step(.15,st.x+(st.y)*curve)*step(st.x-st.y*curve,.5);
    w *= 1.-step(.15+.35,st.x+(st.y)*curve)*step(st.x-st.y*curve,.5+.35);
    w *= 1.-step(.15+.5,st.x-(st.y)*curve)*step(st.x+st.y*curve,.5-.15);
    return w;
}

float K(vec2 st){
    float curve = .75;
    float k = step(.75,st.x)*step(st.x,1.5)*step(.15,-st.y)*step(-st.y,.75);
    k *= 1.-step(st.x-st.y*curve,1.15)*step(.875,st.x);
    k *= 1.-step(-.475,-st.x-st.y*curve)*step(.875,st.x);
    k *= 1.-step(-st.x+st.y*curve,-1.29)*step(-st.x-st.y*curve,-.615);
    return k;
}

float E(vec2 st){
    float e = step(.35,st.x)*step(st.x,.8)*step(.15,-st.y)*step(-st.y,.75);
    e *= 1.-step(.5,st.x)*step(-st.y,.625)*step(.51,-st.y);
    e *= 1.-step(.5,st.x)*step(-st.y,.39)*step(.275,-st.y);
    e *= 1.-step(.75,st.x)*step(-st.y,.6)*step(.3,-st.y);
    return e;
}
//these functions made me feel so samrt yet I probably forgot how they work by now

float rand21(vec2 st){
	st = fract(st*vec2(231.327,142.753));
    st += dot(st, st+41.63);
    return fract(st.x*st.y);
}

float lazer(vec2 st, float r){
    st.y += 1.;
    st *= rot(r);
    st.y -= 1.;
    float h = 1.-s(st.x,.0,.01)*s(-st.x,.0,.01);
    return h;
}
//sometimes you just gotta h some lazers man


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*res.x)/iResolution.y;
    vec2 uv3 = uv; //don't want to be affected by sir modified uv later on chief
    vec2 uv4 = uv;
    vec2 uv5 = uv;
    vec3 col = vec3(0.0);
    uv *= 1.8; //zoom
    uv.x -= .075; //screen's doing a wack, don't mind it
    vec2 uv6 = uv;
    
    
    
    float cap = 643326.1235; //zmart
    float move = 224.124; //zmarterst
    
    float d = 0.; //d
    
    uv5 *= uv5.y-2.; //a classic of mine
    uv5 *= 10.;
	uv5 -= vec2(.0,mod(t,500.)*.1); //stars get yeeha-ed overtime so this will keep'em in line
    vec2 gv = fract(uv5)-vec2(.5,.9);
    vec2 id = floor(uv5);
    const float n = 1.;
    
    for (float y=-n;y<=n;y++){
        for (float x=-n;x<=n;x++){
            vec2 off = vec2(x,y);
            float r1 = rand21(id+off);
            float r2 = rand21(id+off)*10.-.475;
            float f = fract(r1*31.912);
            
    		gv = fract(uv5)-vec2(.5,-1.);
			uv5 -= vec2(.0,mod(t,500.)*-.5);
    		id = floor(uv5);
            
            d = s(.1,1.,.02/distance(1.*gv-off,.75*vec2(r1*12.421,r2)-vec2(1.,.0)))*mix(1.,.5,r2);
            col += d;
        }
    }
    
    
    if (uv.y >= .25*sin(t*cap)-.75){
    	uv.x -= .01*sin(t*move+53213453.351);
    }else if (uv.y <= .25*sin(t*cap)-.75){
        uv.x += .01*sin(t*move+53213453.351);
    }
    
    vec2 uv2 = uv;

    vec2 ap = vec2(.55+.75,.25);
    vec2 wp = vec2(.4+.75,.25);
    vec2 ap2 = vec2(.0,.25);
    vec2 kp = vec2(.4,.25); //why did I keep it like that...
    vec2 ep = vec2(-.55,.25);
    float space = .02; //text space
    float space2 = .005; //grid lines space
    
    uv3 = fract(uv3*3.+space2-vec2(.0,-t));
    uv4 = fract(uv4*3.-space2-vec2(.0,-t));
    
    vec3 grid = vec3(1.-step(uv3.x-.99,2./res.x)*step(uv3.y-.99,1.25/res.y))*.2*vec3(1.,.0,.5);
    vec3 grid2 = vec3(1.-step(uv4.x-.99,2./res.x)*step(uv4.y-.99,1.25/res.y))*.1*vec3(.0,1.,3.);
    
    
    
    vec3 bg = vec3(.0,.0,uv.y*.2+.2)*1.25;
    bg += vec3(-uv.y*.1,.0,-uv.y*.2);
    
    col += max(bg,grid+grid2);
    col += A(uv+vec2(-space+ap.x,ap.y))*vec3(1.,0.,0.5);
   	col += A(uv+vec2(space+ap.x,ap.y))*vec3(0.,1.,1.);
    
    
    col += W(uv+vec2(-space+wp.x,wp.y))*vec3(1.,0.,0.5);
    col += W(uv+vec2(space+wp.x,wp.y))*vec3(0.,1.,1.);
    
    col += A(uv+vec2(-space+ap2.x,ap2.y))*vec3(1.,0.,0.5);
    col += A(uv+vec2(space+ap2.x,ap2.y))*vec3(0.,1.,1.);
    
    col += K(uv+vec2(-space+kp.x,kp.y))*vec3(1.,0.,0.5);
    col += K(uv2+vec2(space+kp.x,kp.y))*vec3(0.,1.,1.);
    
    col += E(uv+vec2(-space+ep.x,ep.y))*vec3(1.,0.,0.5);
    col += E(uv+vec2(space+ep.x,ep.y))*vec3(0.,1.,1.);
    
    float range = .2; //lazer rotation range
    float del = .5; //movement delay
    
    col += vec3(0.,1.,1.)*lazer(uv6-vec2(.3,-1.3),range*sin(t+del*0.)+.6);
    col += vec3(1.,0.,.25)*lazer(uv6-vec2(.25,-1.3),range*sin(t+del*1.)+.45);
    col += vec3(0.,1.,.5)*lazer(uv6-vec2(.2,-1.3),range*sin(t+del*2.)+.3);
    
    col += vec3(0.,1.,.5)*lazer(uv6-vec2(-.35,-1.3),range*sin(t+del*2.+pi)-.3);
    col += vec3(1.,0.,.25)*lazer(uv6-vec2(-.4,-1.3),range*sin(t+del*1.+pi)-.45);
    col += vec3(0.,1.,1.)*lazer(uv6-vec2(-.45,-1.3),range*sin(t+del*0.+pi)-.6);

    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}