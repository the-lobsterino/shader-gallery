#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;
 
float distaceFunction(vec3 pos)
{
  return length(pos) - 1.0;
}
 
void main() {
  vec2 pos = (gl_FragCoord.xy*2.0 -resolution) / resolution.y;
 
  vec3 camPos = vec3(0.0, 0.0, 3.0);
  vec3 camDir = vec3(0.0, 0.0, -1.0);
  vec3 camUp = vec3(0.0, 1.0, 0.0);
  vec3 camSide = cross(camDir, camUp);
  float focus = 3.0;
 
  vec3 rayDir = normalize(camSide*pos.x + camUp*pos.y + camDir*focus);
 
  float t = 0.0, d;
  vec3 posOnRay = camPos;
 
  for(int i=0; i<16; ++i)
  {
    d = distaceFunction(posOnRay);
    t += d;
    posOnRay = camPos + t*rayDir;
  }
 
  if(abs(d) < 0.001)
  {
    gl_FragColor = vec4(1.0);
  }else
  {
    gl_FragColor = vec4(0.0);
  }
}