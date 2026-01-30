#ifdef GL_ES
precision mediump float;
#endif

// bpt learning about fwidth :-)
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rotate(float a,vec2 p)
{
    vec2 cs = vec2( cos(a), sin(a) );
    return p*mat2(cs.x,-cs.y,cs.y,cs.x);
}

float useshape( float a, float b, float c ) {
    //return mix(a,b,c);
    return smoothstep(a,b,-c);
}

float ShapeTest0001( vec2 uv, float N, float t, float whatisthis0to1, float blnd ) {
   
    float D1 = 1.0-dot(uv,uv)/3.141592;
    float D2 = (1.0-(abs(uv.x)+uv.y));
//    float D = mix(D1,D2,t);
    float D = D1*D2/t;
   
    float fw = fwidth(D);
    return D/useshape(fw,-whatisthis0to1 - whatisthis0to1*fw, blnd );
}

void main( void ) {
   
    float t = time * 0.125;
   
    float N = -40.0*(mouse.y-0.5);//*sin(t);

    vec2 uv = (((gl_FragCoord.xy) * 2.0 - resolution) / min(resolution.x, resolution.y));
    vec2 p = mod(uv*N,4.0)-2.0;
   
    p = rotate(uv.x+sin(t*6.28*1.0),p-0.5)+0.5;
   
    p.xy += sin(t*20.0);
   
    float aa = ShapeTest0001( p, N, uv.y/p.y, 1e-3, mouse.x*22.0 );
   
    aa = 1.-pow(aa,10.0);

    gl_FragColor = clamp( vec4( vec3(aa,aa,aa), 1.0 ), 0.0, 1.0 );
}