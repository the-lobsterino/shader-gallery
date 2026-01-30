#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 SpherePos = vec3(0,0,10);
float SphereRad = 3.0;


vec4 GetT(vec3 x,vec3 SpherePos, float SphereRad);



vec3 up = vec3(0,1,0);

void main( void ) {
	vec3 lightDir = normalize(vec3((mouse.x-0.5)*3.0, (mouse.y-0.5)*3.0, -1.0));
	vec3 pos = vec3(gl_FragCoord.x/resolution.y-1.0, gl_FragCoord.y/resolution.y-0.5,  1.0);
	vec3 x = normalize(vec3(pos.xy,1.0));
  	vec4 res = GetT(x, SpherePos, SphereRad);
 	vec3 intreseptionPoint = res.x*x;
  	vec3 normal = normalize(intreseptionPoint - res.yzw);
  	float diff = max(dot(lightDir, normal),0.0);
	float reflected = pow(max(dot(normalize(reflect(lightDir, -normal)), pos), 0.0), 16.0);
  	if (res.x > -1.0)
    		gl_FragColor = vec4(0.9, 0.8, 0.1, 1.5)*(diff*1.9 + reflected*0.2 +  0.5);
  	else
    		gl_FragColor = vec4(.5,.5,.8,8.0);

}

vec4 GetT(vec3 x, vec3 SpherePos, float SphereRad){
  
  vec4 res = vec4(100.0);
  vec3 x0 = SpherePos;
  float R = SphereRad;

  float D = 4.0*(pow(dot(x,x0),2.0) - pow(length(x),2.0)*pow(length(x0),2.0)+pow(length(x),2.0)*pow(R,2.0));
  if (D>0.0){
  if (res.x>(2.0*dot(x,x0) - sqrt(D))/(2.0*pow(length(x),2.0))){
  res = vec4((2.0*dot(x,x0) - sqrt(D))/(2.0*pow(length(x),2.0)),x0);
  
  }
  }
  if(res.x!= 100.0)
    return res;
  return vec4(-1);

}