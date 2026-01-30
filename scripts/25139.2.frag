precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

const vec3 lightDir = vec3(-0.3, 1.0, 0.57);

vec3 trans(vec3 p, float m)
{
  return mod(p, m) - m / 2.0;
}

float distSp1(vec3 pos)
{
	
	return length(trans(pos, 2.0)) - 1.0;
}

float distSp2(vec3 pos){
	return length(trans(pos, 2.0)) - 1.6;
}

float distanceFunction(vec3 pos){
	
	float d1 = distSp1(pos);
	float d2 = distSp2(pos);
	return min(d1, d2) ;
}
 
vec3 getNormal(vec3 p)
{
  const float d = 0.001;
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
 
  vec3 camPos = vec3(mouse*10.0, mod(time,1000.0));
  vec3 camDir = vec3(0.0, 0.0, -1.0);
  vec3 camUp = vec3(0.0, 1.0, 0.0);
  vec3 camSide = cross(camDir, camUp);
  float focus = 1.8;
 
  vec3 rayDir = normalize(camSide*pos.x + camUp*pos.y + camDir*focus);
 
  float t = 1.0, d;
  vec3 posOnRay = camPos;
 
  for(int i=0; i<50; ++i)
  {
    d = distanceFunction(posOnRay);
    t += d;
//if(t>10.) break;
    posOnRay = camPos + t*rayDir;
  }
 
  vec3 normal = getNormal(posOnRay);
  vec3 color;
  if(abs(d) < 0.001)
  {
    float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
    color = vec3(diff);
  }else
  {
    color = vec3(0.0);
  }
  gl_FragColor = vec4(color, 1.0);
}