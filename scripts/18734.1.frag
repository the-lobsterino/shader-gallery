#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
 
vec3 trans(vec3 p)
{
 float a = 6.0;
float b = 4.0;
  //return mod(p, 8.0)-4.0;
  return mod(p, a)-b;
}
 
float lengthN(vec3 v, float n)
{
  vec3 tmp = pow(abs(v), vec3(n));
  return pow(tmp.x+tmp.y+tmp.z, 1.0/n);
}
 
float distanceFunction(vec3 pos)
{
  //return lengthN(trans(pos), 4.0) - 1.0;
  return length(trans(pos)) - 0.8 + 0.3 * cos(time);
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
  float speed_fall = 22.0;
  vec2 pos = (gl_FragCoord.xy*2.0 -resolution ) / resolution.y;
 
  vec3 camPos = vec3(
	  cos(time * 0.1) * 6.0, 
	  cos(time * 0.4) * 0.7 + 1.0, 3.0 - time * speed_fall );
  vec3 camDir = vec3(0.1 * cos(time), 0.05*cos(time*2.0), -1.0);
  vec3 camUp = vec3(0.0, 1.0, 0.0);
  vec3 camSide = cross(camDir, camUp);
  float focus = 1.8;
 
  vec3 rayDir = normalize(camSide*pos.x + camUp*pos.y + camDir*focus);
 
  float t = 0.0, d;
  vec3 posOnRay = camPos;
 
vec4 def = vec4(0.0,0.05,0.3,0.0);
  
  vec4 col = vec4(0.007,0.0,0.1,0.001)*2.5 + vec4(0.0,0.05,0.01,0.0);
 
  for(int i=0; i<100; ++i)
  {
    d = distanceFunction(posOnRay);
    t += d;
    posOnRay = camPos + t*rayDir;
 	 if(abs(d) < 0.001)
 	 {
	  vec4 col_add =  col/pow(t,1.0);
		 //col_add.rb*=0.9;
		 //col_add.g += 0.1*pow(t,-2.0);
	if(t>120.0){
	 gl_FragColor += col_add;
		 }else{
	 	   gl_FragColor += col_add *0.8;
		 }
		 
 	 }else{
		 gl_FragColor.g-=0.005;
	 }
  	}
  
	 	   gl_FragColor += def;
	
	/*
  if(abs(d) < 0.001)
  {
    gl_FragColor = vec4(1.0);
  }else
  {
    gl_FragColor = vec4(0.0);
 
  }
*/
}


