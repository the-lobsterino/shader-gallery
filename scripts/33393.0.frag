///////////////////////////////////////////////////////
//*****************************************************
//Power Language.glsl made by 834144373(恬纳微晰)
//Version: 1.01 alpha	Date:2016/6/15 19:xx
//Tags: Japanese,Font,Language,Words
//Original: https://www.shadertoy.com/view/XsGXzt
//*****************************************************

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 uv;

const lowp vec2 font_size = vec2(15.,16)*1.1;
const lowp int content_size = 16;
lowp int num4row ;
#define start_pos(where_x,where_y) uv.x=u.x-=where_x;uv.y-=16.*(float(num4row)-1.)-where_y;
#define adjacency_width 2
#define adjacency_height 2

#define first_word_pos(with) uv.x-= float(15+adjacency_width)*float(with);

struct Data{
    vec3 a,c;
    vec2 b,d;
};

Data w;
#define Font c+=font(w);

#define _Exc w.a=vec3(0,0xCC,0);w.b=vec2(0,0);w.c=vec3(0,0x7F,0);w.d=vec2(0,0);Font

#define _XoX_ w.a=vec3(0xF08000,0xEC9CF8,0xF6F6F6);w.b=vec2(0x9CECF6,0x80F0F8);w.c=vec3(0xF0100,0x3D391F,0x7F7F7F);w.d=vec2(0x393D7F,0x10F1F);Font

#define next uv.x = u.x;uv.y += 16.+ float(adjacency_height);

float Bin(float n,float u,float v,out lowp float c){
    return (u>=0. && v>=0. && u<=2. && v<=7.) ? mod(floor(n/(exp2(8.*u+v))),2.) : c;
}

float arrayBin(Data f){
    float c = 0.,o = 3., y = uv.y-8.;
    uv.x -= 0.;c= Bin(f.a.r,uv.x,uv.y,c);c = Bin(f.c.r,uv.x,y,c);
    uv.x -= o;c = Bin(f.a.g,uv.x,uv.y,c);c = Bin(f.c.g,uv.x,y,c);
    uv.x -= o;c = Bin(f.a.b,uv.x,uv.y,c);c = Bin(f.c.b,uv.x,y,c);
    uv.x -= o;c = Bin(f.b.r,uv.x,uv.y,c);c = Bin(f.d.r,uv.x,y,c);
    uv.x -= o;c = Bin(f.b.g,uv.x,uv.y,c);c = Bin(f.d.g,uv.x,y,c);
    return c;
}

float font(Data f){
    float c = 0.;
    c = arrayBin(f);
    uv.x -= 3.+ float(adjacency_width);
    return c;
}

void main()
{
    lowp float c = 0.;
    vec2 u = vec2(0.);
    {
        u = gl_FragCoord.xy/resolution.y;
        u *= float(content_size);
        u = floor(uv=u*font_size);
        num4row = content_size-num4row;
        /*{
        //if(abs(uv.x-(u.x))<0. || abs(uv.y-(u.y))<0.){
        	//u=vec2(-1.);
        //}
        }*/
        uv = u;
    }
    
    start_pos(160.,100.);
    
        first_word_pos(2)
        _XoX_ uv.y *= -1.; 
        _XoX_ uv.y *= -1.; 
        _XoX_ uv.y *= -1.; 
        _XoX_ uv.y *= -1.; 
        _XoX_ uv.y *= -1.; 
        _XoX_ uv.y *= -1.; 
        _XoX_ uv.y *= -1.; 
        _XoX_ uv.y *= -1.; 
   
    gl_FragColor = (1.-vec4(c,c,c,1.))/1.2;
    
    
}