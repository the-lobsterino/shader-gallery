precision highp float;

uniform vec2 resolution;
uniform float time;

const float pi = 3.141592;

//BPM
const float bpm = 89.;

mat2 rot(float r)
{
  float s = sin(r);
  float c = cos(r);
  return mat2(c,s,-s,c);
}

vec2 myTwist(vec3 p,float power)
{
  float s = sin(power*p.z);
  float c = cos(power*p.z);
  mat2 n = mat2(c,s-2.,-s,c);
  return p.xy*n;
}

vec2 pmod(vec2 p,float r)
{
  float a = atan(p.x,p.y) + pi/r;
  float n = pi *2. / r;
  a = floor(a/n) * n;
  return p*rot(-a);
}

float cube(vec3 p, vec3 s)
{
  vec3 q = abs(p) - s;
  return max(max(q.x,q.y),q.z);
}

float map(vec3 p)
{
  float tbpm = time * bpm / 60.;

  vec3 q = p;

  if(mod(floor(tbpm),4.) <= 1.)
  {
    q.xy = myTwist(q,0.2*exp((tbpm)*0.00001));
  }
  if(mod(floor(tbpm),4.) >= 2.)
  {
    q.xy = myTwist(q,0.2*(sin(tbpm)*0.00001));
  }

  float obj = 0.;
  float add = 1.;
  for(int i = 0; i < 7; i++)
  {
    q.xy = abs(q.xy) - add;
    q.xy *= rot(add);
    q.xy = pmod(q.xy,add);
    q.z = mod(q.z,4.)-2.;
    float d = cube(q,vec3(1.));
    float d2 = cube(q,vec3(.5,.5,2.));
    float d3 = cube(q,vec3(2.,.5,.5));
    float d4 = cube(q,vec3(.5,2.,.5));
    obj = max(max(max(d,-d2),-d3),-d4);
    obj = min(obj,1e5);
    add += .1;
  }

  return obj;
}

void main()
{
  vec2 p = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x,resolution.y);

  float tbpm = time * bpm / 60.;
  float seq = floor(tbpm);

  //camera
  vec3 cPos = vec3(0.,0.,10.);
  cPos.z -= time*20. + (5.*(abs(sin(tbpm*3.08))));
  vec3 cDir = vec3(0.,0.,-1);
  vec3 cUp = vec3(0.,1.,0.);
  vec3 cSide = cross(cDir , cUp);
  float targetDepth = 1.;

  //ray
  vec3 ray = normalize(p.x * cSide + p.y * cUp + cDir * targetDepth);

  //color
  float mainEmissive = 0.;
  vec3 color = vec3(0.);

  //raymarching
  float dist = 0.;
  float rLen = 0.;
  vec3 rPos = cPos;

  for(int i = 0; i< 128; i ++)
  {
    dist = map(rPos);
    rLen += dist;
    rPos = cPos + rLen * ray;
    mainEmissive += exp(dist*-0.2);
    if(dist < 0.001)
    {
      break;
    }
  }

  float emissiveValue = mainEmissive * 0.02;

  color = vec3(0.3,0.27,0.7);
  gl_FragColor = vec4(color*emissiveValue,1.);
}
