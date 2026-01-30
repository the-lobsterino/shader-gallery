precision highp float;

uniform vec2 resolution;
uniform float time;
#define bpm 160.

mat2 rot(float r)
{
  float s = sin(r);
  float c = cos(r);
  return mat2(c,s,-s,c);
}
float sphere(vec3 p)
{
  return length(p) -1.;
}
float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}
float sdBoxFrame( vec3 p, vec3 b, float e )
{
  p = abs(p  )-b;
  vec3 q = abs(p+e)-e;
  return min(min(
      length(max(vec3(p.x,q.y,q.z),0.0))+min(max(p.x,max(q.y,q.z)),0.0),
      length(max(vec3(q.x,p.y,q.z),0.0))+min(max(q.x,max(p.y,q.z)),0.0)),
      length(max(vec3(q.x,q.y,p.z),0.0))+min(max(q.x,max(q.y,p.z)),0.0));
}
float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float map(vec3 p)
{
  //bpm
  float tbpm = time*bpm/60.0;
  float seq_time = mod(floor(tbpm),4.0);

  if(seq_time == 0.)
  {
    return sphere(p);
  }
  if(seq_time == 1.)
  {
    return sdBox(p,vec3(1.));
  }
  if(seq_time == 2.)
  {
    return sdBoxFrame(p,vec3(1.),.1);
  }
  if(seq_time == 3.)
  {
    return sdTorus(p,vec2(1.,.1));
  }

}

vec3 getNormal(vec3 p)
{
  float d = 0.001;
  float x = map(p + vec3(d,0.,0.)) - map(p + vec3(-d,0.,0.));
  float y = map(p + vec3(0.,d,0.)) - map(p + vec3(0.,-d,0.));
  float z = map(p + vec3(0.,0.,d)) - map(p + vec3(0.,0.,-d));

  return normalize(vec3(x,y,z));
}
void main()
{

  vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x,resolution.y);

  //camera
  vec3 cPos = vec3(0.,0.,3.);
  cPos.xz *= rot(time);
  cPos.y += sin(time);
  vec3 cTar = vec3(0.,0.,0.);
  vec3 cDir = normalize(vec3(cTar - cPos));
  vec3 cUp = vec3(0.,1.,0.);
  vec3 cSide = cross(cDir,cUp);
  float targetDepth = 1.;

  //ray
  vec3 ray = normalize(p.x * cSide + p.y * cUp + cDir * targetDepth);
  vec3 lightDir = vec3(1.,1.,1.);

  //raymarching
  float distance = 0.;
  float rLen = 0.;
  vec3 rPos = cPos;
  for(int i = 0; i < 32; i++)
  {
    distance = map(rPos);
    rLen += distance;
    rPos = cPos + rLen * ray;
  }
  if(distance < 0.001)
  {
    vec3 normal = getNormal(rPos);
    float light = clamp(dot(normal,lightDir),0.1,1.);
    gl_FragColor = vec4(vec3(light),1.);
  }




}
