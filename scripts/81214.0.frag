precision highp float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

mat2 rot(float r)
{
  return mat2(cos(r),sin(r),-sin(r),cos(r));
}

vec2 random2(vec2 st)
{
  st = vec2( dot(st,vec2(127.1,311.7)),
  dot(st,vec2(269.5,183.3)) );
  return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float perlinNoise(vec2 st) 
{
  vec2 p = floor(st);
  vec2 f = fract(st);
  vec2 u = f*f*(3.0-2.0*f);
  
  vec2 v00 = random2(p+vec2(0,0));
  vec2 v10 = random2(p+vec2(1,0));
  vec2 v01 = random2(p+vec2(0,1));
  vec2 v11 = random2(p+vec2(1,1));
  return mix( mix(dot( v00, f - vec2(0,0) ), dot( v10, f - vec2(1,0) ), u.x ),
                             mix( dot( v01, f - vec2(0,1) ), dot( v11, f - vec2(1,1) ), u.x ), 
                             u.y)+0.5;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float map(vec3 p)
{
  //p = mod(p,6.) - 3.;
  
  p.xy *= rot(time);
  p.xz *= rot(time);
  
  float d = sdBox(p,vec3(2,2,2));
  return d;
}

void main()
{
  vec2 p = (gl_FragCoord.xy *2.0 - resolution.xy) / min(resolution.x,resolution.y);
  
  vec3 cp = vec3(0,0,5);
  vec3 cd = vec3(0,0,-1);
  vec3 cu = vec3(0,1,0);
  vec3 cs = cross(cu,cd);
  float ta = 1.0;
  
  vec3 ray = normalize(p.x*cs + p.y*cu + cd*ta);
  vec3 col = vec3(0.0);
  float me = 0.0;
  
  float d,l = 0.0;
  vec3 rp = cp;
  for(int i=0; i<60; i++)
  {
    d = map(rp);
    l += d;
    rp = cp + l * ray;
    me += exp(abs(d)*-0.2);
    if(d < 0.001)
    {
      //col = vec3(1.0);
      float dissolve = step(sin(time)+0.1,perlinNoise(rp.xy*5.0));
      col = vec3(dissolve);
      break;
    }
  }
  col *=  me * 0.15 ;
  gl_FragColor = vec4(col,1.0);
  
}