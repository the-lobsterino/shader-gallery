#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
 
vec3 trans(vec3 p)
{
  //return mod(p, 7.0)-4.0;
  //return mod(p + time, 6.0)-2.0;
  //return mod(p + time, 28.0)-14.0;
	vec3 ret = mod(p, 8.0)-4.0;
  return ret * 0.5;
//	float a = 8.0 + cos(time * 0.1);
 // return mod(p, a) - a/2.0;
	/*
  return mod(
	  vec3(
	      p.x + cos(time),
	      p.y + cos(time),
	      p.z + cos(time)) * 2.0, 6.0)-1.0;
	*/
}
 
float lengthN(vec3 v, float n)
{
  vec3 tmp = pow(abs(v), vec3(n));
  return pow(tmp.x+tmp.y+tmp.z, 1.0/n);
}
 
float GetR(float t){
	float interval = 0.1;
	float r_small = .1;
	float r_min = 0.1;
	float r_max = 0.1;
	float r_amp = (r_max-r_min)/2.0;
	if(mod(t,interval*2.0)<interval){
		return  (r_max) +  (r_amp)*cos(t) + 0.15*r_small*cos(t*45.0);
	}else{
		return  (r_max) +  (r_amp)*cos(t) + 0.25*r_small*cos(t*10.0);
	}
}
float distanceFunction(vec3 pos)
{
  //return lengthN(trans(pos), 2.0) - 1.0;
  //return length(trans(pos))-2.0;
	float r = 0.5;
  return length(trans(pos))- GetR(time);
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
 
	vec3 camPos = vec3(0.0, 0.0, 400000.0 + - time*2.5);
  vec3 camDir = vec3(0.0, 0.0, -1.0);
  vec3 camUp = vec3(0.0, 1.0, 0.0);
  vec3 camSide = cross(camDir, camUp);
  float focus = .1;
 
  vec3 rayDir = normalize(camSide*pos.x + camUp*pos.y + camDir*focus);
 
  float t = 0.0, d;
  vec3 posOnRay = camPos;
 
  for(int i=0; i<150; ++i)
  {
    d = distanceFunction(posOnRay);
    t += d;
    posOnRay = camPos - t*rayDir;
  }
 
  vec3 normal = getNormal(posOnRay);
//vec4 def = vec4(0.0,0.0,0.4,0.0);
vec4 def = vec4(0.4,0.8,0.0,0.0)*0.5;
  if(abs(d) < 0.001)
  {
    //gl_FragColor = vec4(normal, 1.0);
	  float val = 100.0/(10.0+abs(pow(t,2.1)));
    gl_FragColor = vec4(0.1,0.6,.99 + normal.x*4.0,1.0) * val + def;
  }else
  {
    gl_FragColor = vec4(0.0) + def /pow(t,.5);
  }
}