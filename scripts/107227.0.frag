#ifdef GL_ES
precision mediump float;
#endif


#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

mat2 rot(float a)
{
  float s = sin(a);
  float c = cos(a);
  return mat2(c, s, -s, c);
}

vec3 pat1(vec2 pos)
{
    pos*=rot(length(pos)*0.5+pos.x*pos.y);
    float vv = pos.y*pos.y;
    vv*=sin(pos.x*1.04);
    float v = (sin(sin(pos.x*5.0)*4.0+(vv) *50.0 + time * 2.0))+0.25;
    v=abs(v);
    vec3 col = vec3( 1.5,0.8,0.6+sin(time)*0.5)*v ;
    return col;
}

void main( void ) 
{
    vec2 pos = (gl_FragCoord.xy / resolution.xy);
    pos-=vec2(0.5);
    vec3 back = pat1(pos);
    back *= pat1(pos*rot(0.5));
    gl_FragColor = vec4( back,1.0);
}