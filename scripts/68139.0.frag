precision highp float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

mat2 rot(float a)
{
  return mat2(cos(a), -sin(a), sin(a), cos(a));
}

vec3 getId(vec3 p) { return floor(p / 4.0); }

vec3 getColor(vec3 p)
{
  vec3 id = getId(p);
  return sin((id.x + id.y * 0.9 + id.z * 0.8 + time * 3.0) + vec3(4, 3, 2)) * 0.5 + 0.5;
}

float dist(vec3 p)
{
  vec3 id = getId(p);
  p = mod(p, 4.0) - 2.0;
  
  float scale = 1.0;
  for (int i = 0; i < 6; ++i)
  {
    p = abs(p);
    p -= sin(time + id * 4.0) * 0.5  + vec3(0.1, 0.4, 0.3);
    if (p.x > p.y) p.xy = p.yx;
    if (p.z > p.y) p.zy = p.yz;
    if (p.x > p.z) p.xz = p.zx;
    
    p *= 2.0;
    scale *= 2.0;
  }
  return length(p) / scale - 0.01;
}

void main(){
  vec3 startPos = vec3(0, 0, time * 4.0);
  vec3 pos = startPos;
  vec3 dir = normalize(vec3((gl_FragCoord.xy*2.-resolution) / min(resolution.x,resolution.y), 1.0));
  dir.xy = rot(time * 0.1) * dir.xy;
  dir.xz =  rot(time * 0.05) * dir.xz;
  dir.yz =  rot(time * 0.08) * dir.yz;
  
  for (int i = 0; i < 128; ++i)
  {
    float d = dist(pos);
    pos += d * dir * 0.6;
    if (d < 0.001) 
    {
      break;
    }
  }
  
  gl_FragColor = vec4((1.0 - pow(length(startPos - pos) * 0.02, 0.5)) * getColor(pos), 1.0);
}