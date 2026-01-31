/*
 * Original shader from: https://www.shadertoy.com/view/NsVyRy
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define PI 3.1415
#define t iTime

vec2 polar(vec2 p){
    return vec2(
        atan(p.y, p.x),
        sqrt(p.x*p.x+p.y*p.y)
    );
}

float sun(vec2 uv){
    const float SUN_RAYS = 12.;
    uv += vec2(.7, -.35);
    vec2 p = polar(uv);
    float s = 1.-smoothstep(.1, .15, length(p.y));
    float r = smoothstep(.5,.7,sin((p.x+t*0.1)*SUN_RAYS));
    r *= smoothstep(.9, .3, p.y);
    return clamp(s+r,.0, 1.);
}

float background(vec2 uv){
    return uv.y;
}

vec2 ground(vec2 uv){
    float p = uv.y + sin(uv.x*4.)/8.+sin(uv.x+0.5*8.)/16.+sin(uv.x*16.)/32.;
    //p = clamp(.0,1.,p);
    float hor = 1.-smoothstep(.2, .25, p);
    hor = hor-p-0.4;
    //hor = clamp(hor,.0,1.);
    
    float outline = abs(hor);
    outline = 1.-smoothstep(.25,.35, outline);
    //outline = clamp(outline,.0,1.);
    
    return vec2(hor, outline);
}

vec3 trees(vec2 uv){
    float ps = sin(uv.x*4.)/8.+sin(uv.x*sin(t*.15)+0.5*8.)/16.+sin(uv.x*sin(t*.1)*16.)/32.+0.5;
    float pf = max(fract(uv.x*12.), fract(-uv.x*12.));
    float p = uv.y + ps*ps*ps*pf + 0.3;
    float tree = 1.-smoothstep(.75, .8, p);
    tree = clamp(tree,.0, 1.);
    
    float gradTree = min(tree, uv.y*2.);
    gradTree = clamp(gradTree,.0, 1.);
    
    float outline = abs(tree)-0.1;
    outline = max(tree, 1.-outline);
    outline = smoothstep(.8,.9, outline);
    outline = clamp(outline,.0,1.);
    
    return vec3(tree, gradTree, outline);
}

vec3 mountains(vec2 uv){
    float skew = uv.y*sin(t*1.)*0.05;
    
    mat2 mat = mat2(
        1.0,0.0,
        skew,1.0);
    uv = mat*uv;
    
    uv -= vec2(7.15, 0.2);
    uv *= vec2(.4,4.0);
    
    float ms = sin(uv.x*8.)/8.+sin(uv.x*8.)/8.+sin(uv.x*16.)/16.-0.4;
    float mf = max(fract(uv.x*10.), fract(-uv.x*10.))*8.;
    float p = uv.y + ms*ms*ms*mf;
    //p = smoothstep(uv.y*2.,uv.y/2., uv.y);
    float mount = 1.-smoothstep(.45, .55, p);
    mount = clamp(mount,.0, 1.);
    
    float gradMount = min(mount, uv.y/2.5);
    gradMount = clamp(gradMount,.0,1.);
    
    float outline = abs(mount)-0.05;
    outline = max(mount, 1.-outline);
    outline = smoothstep(.85,.95, outline);
    outline = clamp(outline,.0,1.);
    
    return vec3(mount, gradMount, outline);
}

vec3 box(vec2 uv){
    vec2 size = vec2(4.,2.7);
    vec2 pos = vec2(-2.8,-.2);
    
    vec2 uv1 = uv*size+pos;
    vec2 lb = smoothstep(0.,.1, uv1);
    vec2 tr = smoothstep(1.,.9, uv1);
    float soft = lb.x*lb.y*tr.x*tr.y;
    
    vec2 uv2 = uv*size*vec2(1., 0.7)+pos+vec2(.0,.27);
    vec2 lb2 = smoothstep(0.,.1, uv2);
    vec2 tr2 = smoothstep(1.,.9, uv2);
    float hard = lb2.x*lb2.y*tr2.x*tr2.y;
    hard = step(0.9, hard);
    
    float outline = max(soft, 1.-soft);
    outline = smoothstep(.9,.91, outline);
    outline = max(outline, hard);
    
    soft = hard*smoothstep(.05, 1.,uv2.y);
    
    return vec3(soft, hard, outline);
}

vec3 roof(vec2 uv){
    vec2 size = vec2(2.7, 5.1);
    vec2 pos = vec2(-0.87,-1.07);
    
    vec2 uv0 = (uv-vec2(.5,.0))*vec2(1.,.5);
    uv0 = uv0*size+pos;
    vec2 uv1 = 1.-(uv0+vec2(.0,.03));
    vec2 uv2 = abs(uv0)-vec2(.0,.4);
    float b = smoothstep(1.,.9, uv1.y);
    float tr = smoothstep(.1,.0, uv2.x+uv2.y);
    float soft = min(tr, b);
    
    float hard = step(0.9, soft);
    
    float outline = max(soft, 1.-soft);
    outline = smoothstep(.9,.91, outline);
    
    return vec3(soft, hard, outline);
}



    
    



