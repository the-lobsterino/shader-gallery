#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 trans(vec3 p)
{

  return mod(p, 8.)-4.0;
}
float lengthN(vec3 v, float n)
{
  vec3 tmp = pow(abs(v), vec3(n));
  return pow(tmp.x+tmp.y+tmp.z, 1.0/n);
}
float distaceFunction(vec3 pos)
{

  	return length(trans(pos)) - 1.;
	//return lengthN(trans(pos), 2.) - 1.0;
}

vec3 getNormal(vec3 p)
{
  const float d = 0.0001;
  return
    normalize
    (
      vec3
      (
        distaceFunction(p+vec3(d,0.0,0.0))- distaceFunction(p+vec3(-d,0.0,0.0)),
        distaceFunction(p+vec3(0.0,d,0.0))- distaceFunction(p+vec3(0.0,-d,0.0)),
        distaceFunction(p+vec3(0.0,0.0,d))- distaceFunction(p+vec3(0.0,0.0,-d))
      )
    );
}
 
void main() {
	

  vec2 pos = (gl_FragCoord.xy*2.0 -resolution) / resolution.y;
 

  vec3 camPos = vec3(0.0, 0.0, 3.0);
	

  vec3 camDir = vec3(0.0, 0.0, -1.0);
	

  vec3 camUp = vec3(0.0, 1.0, 0.0);
	

  vec3 camSide = cross(camDir, camUp);
	

	
	
  float focus = 1.8;
 

	vec3 pixelPos = vec3(pos.x, pos.y, 1);
	vec3 rayDir = normalize(pixelPos - camPos);

 
  float t = 0.0, d;
  vec3 posOnRay = camPos;
 
  for(int i=0; i<18; ++i)
  {

    d = distaceFunction(posOnRay);

    t += abs(d);
	
    posOnRay = camPos + t*rayDir;
  }
 
	vec3 normal = getNormal(posOnRay);
  if(abs(d) < 0.01)
  {
    gl_FragColor = vec4(1.0) + vec4(normal, 1.);
  }else
  {
    gl_FragColor = vec4(0.0);
  }
}