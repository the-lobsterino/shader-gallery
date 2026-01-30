precision mediump float;

uniform vec2 resolution;
uniform float time;

const float pi = 3.141592;

mat2 rot(float r)
{
  float s = sin(r);
  float c = cos(r);
  return mat2(c,s,-s,c);
}

vec2 pmod(vec2 p, float r)
{
  float a = atan(p.x,p.y) + pi/r;
  float n = pi * 2. / r;
  a = floor(a/n)*n;

  return p*rot(-a);
}

float sphere(vec3 p,float r)
{
  return length(p) - r;
}

float cube(vec3 p,vec3 s)
{
  vec3 q = abs(p) - s;
  float d = max(max(q.x,q.y),q.z);

  return d;
}

float map(vec3 p)
{
  vec3 q = p;
  q.yz *= rot(pi);
  float obj = 0.;

  //anim
  q.xy *= rot(exp(sin(time)*2.));
  q.z += (exp(sin(time)*4.));

  q.z = mod(q.z,22.)-11.;

  float add = 0.25;
  q.xy = pmod(q.xy,4.);
  for(int i = 0; i < 7; i++)
  {
    q.xy = abs(q.xy);
    q.xy = abs(q.xy) - vec2(abs(cos(time))*1.2);
    q.xz *= rot(pi*add);
    q.yz *= rot(pi*add);
    q.xy = pmod(q.xy,add);
    q.xy = abs(q.xy) - .9;
    q.xz = pmod(q.xz,3.);

    float d = cube(q,vec3(1.,1.,1.));
    float d2 = sphere(q,1.3);
    obj = max(d,-d2);
    obj = min(obj,1e5);

    add *= 2.;
  }

  return obj;
}

void main(){
  vec2 p = (gl_FragCoord.xy * 2. - resolution.xy)/min(resolution.x,resolution.y);

  //camera
  vec3 cPos = vec3(-9.,4.,18.);
  cPos.xz *= rot(0.7);
  vec3 cTar = vec3(0.);
  vec3 cDir = normalize(cTar - cPos);
  vec3 cUp = vec3(0.,1.,0.);
  vec3 cSide = cross(cDir,cUp);
  float targetDepth = 1.;

  //ray
  vec3 ray = normalize(vec3(p.x * cSide + p.y * cUp + cDir * targetDepth));

  //color
  vec3 color = vec3(0.);
  float fogDist = 0.;
  float mainEmissive = 0.;

  //raymarching
  float dist = 0.;
  float rLen = 0.;
  vec3 rPos = cPos;

  for(int i = 0; i < 64; i++)
  {
    dist = map(rPos);
    fogDist += dist;
    mainEmissive += exp(dist*-0.2);
    rLen += dist;
    rPos = cPos + rLen * ray * cos(time);
    if(dist < 0.001)
    {
      break;
    }
  }
  vec3 fogColor = vec3(.1,.1,.1)*1.;

  color = vec3(1.,1.,1.);
  gl_FragColor = vec4(color*mainEmissive*0.03,1.);
}
