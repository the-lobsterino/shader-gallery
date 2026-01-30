#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

const vec3 lightDir = vec3(-0.3, 1.0, 0.57);

vec3 trans(vec3 p)
{
  return mod(p, 8.0) - 4.0;
}

float distanceFunction(vec3 pos)
{
  vec3 q = abs(trans(pos));
  return length(max(q - vec3(1.0, 1.0, 1.0), 0.0)) - 0.1;
}
 
vec3 getNormal(vec3 p)
{
  const float d = 0.0001;
  return
    normalize
    (
      vec3
      (
        distanceFunction(p+vec3(d,0.0,0.0))-distanceFunction(p+vec3(-d,0.0,0.0)),
        distanceFunction(p+vec3(0.0,d,0.0))-distanceFunction(p+vec3(0.0,-d,0.0)),
        distanceFunction(p+vec3(0.0,0.0,d))-distanceFunction(p+vec3(0.0,0.0,-d))
      )
    );
}
 
void main() {
  vec2 pos = (gl_FragCoord.xy*2.0 -resolution) / resolution.y;
 
  vec3 camPos = vec3(0.0, 0.0, 3.0) + vec3(mouse*10.0, (sin(time/6.0)+cos(time/2.0))*10.0);
  vec3 camDir = vec3(0.0, 0.0, -1.0);
  vec3 camUp = vec3(0.0, 1.0, 0.0);
  vec3 camSide = cross(camDir, camUp);
  float focus = 1.8;
 
  vec3 rayDir = normalize(camSide*pos.x + camUp*pos.y + camDir*focus);
 
  float t = 0.0, d;
  vec3 posOnRay = camPos;
 
  for(int i=0; i<64; ++i)
  {
    d = distanceFunction(posOnRay);
    
    t += d;
    if (d < 0.05 || t > 90.0) break;
    posOnRay = camPos + t*rayDir;
    
  }
 
  vec3 normal = getNormal(posOnRay);
  vec3 color;
  if(d < 0.05)
  {
    float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
    color = vec3(diff);
  }else
  {
    color = vec3(0.0);
  }
  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}