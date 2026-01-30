precision mediump float;
uniform sampler2D backbuffer;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;
float TIME = time/10.+ mouse.x*10. ;
float ft = sin(time/3.)+1.;
// uniform vec2 position;
vec3 trans(vec3 p)

{
	float f = 8.;
	float s = -f/2.;
	return mod(p, f)+ s;}

float distanceFunction(vec3 pos)
{
	float xshfit = (6.)*gl_FragCoord.x/resolution.x;
	return length(trans(pos)*.7*(1.+.5*(0.+sin(pos*ft*1.)))) -1.5*xshfit;}
 

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
mat3 transpose (mat3 matrix){return mat3( vec3(matrix[0].x,matrix[1].x,matrix[2].x), vec3(matrix[0].y,matrix[1].y,matrix[2].y), vec3(matrix[0].z, matrix[1].z, matrix[2].z));}
mat3 cycleLeft (mat3 matrix){return mat3 ( matrix[1], matrix[2], matrix[0]);}
mat3 cycleRight(mat3 matrix){return mat3 ( matrix[2], matrix[0], matrix[1]);}
mat3 cycleUp   (mat3 matrix){return mat3 (transpose(cycleLeft(transpose(matrix))));}
mat3 cycleDown (mat3 matrix){return mat3 (transpose(cycleRight(transpose(matrix))));}
mat3 swapLC    (mat3 matrix){return mat3 (matrix[1], matrix[0], matrix[2]);}
mat3 r1(float time,float shift, float stretch){
	float t = time;
	float s = stretch;
	float x = stretch*shift;
	return mat3( cos(t)*s + x, sin(t)*s + x, 0., -sin(t)*s + x, cos(t)*s +x,0.,0.,0.,1.);}

mat3 r_1 (float theta) {return r1(theta, 0. ,1. );}

//^^^^^^^^^^^^^^^^^^ derviative operator 

void main() {
	mat3 I = mat3(1.,0.,0.,
		      0.,1.,0.,
		      0.,0.,1.);
	
  vec2 pos = (gl_FragCoord.xy*2.0 -resolution) / resolution.x;
 
  vec3 camPos = vec3(0.0, 0.0, 3.0);
  vec3 camDir = vec3(0., 0., -1.0);
	camDir = camDir * cycleUp(swapLC(cycleRight((r_1(TIME/10.)))));
	
  vec3 camUp = vec3(0.0, 1.0, 0.0)*r_1(TIME/10.);;
  vec3 camSide = cross(camDir, camUp);
 // float focus = 1.5+4.0;
 
  mat3 focus = mat3(1.,0.,0.,
		    0.,1.,0.,
		    0.,0.,1.);
	
	vec3 pos3 = vec3(pos,camDir.z*10.);
	
	camDir = vec3(
		camDir.x,
		camDir.y,
		camDir.z);
	//camDir*=normalize(dot(camDir,pos3));
 
	vec3 rayDir = normalize(camSide*pos.x + camUp*pos.y + camDir*focus);

  float t = 0.0, d;
  vec3 posOnRay = camPos;
 
	float steps = 0.;
  for(int i=0; i<164; ++i)
  {
	  
    d = distanceFunction(posOnRay);
    t += d;
    posOnRay = camPos + t*rayDir;
	  if (abs(d) >.001){steps = float(i);};
  }
 
  vec3 normal = getNormal(posOnRay);
  if(abs(d) < 0.001)
  {
    gl_FragColor = vec4(normal*(sin(time/10.)*80.)/steps, 1.0);
  }else
  {
    gl_FragColor = vec4(0.);
  }
	gl_FragColor = mix(gl_FragColor, vec4(steps/160.),1.+.5*cos(time/17.));
	gl_FragColor = mix(gl_FragColor, texture2D(backbuffer, gl_FragCoord.xy / resolution.xy),.85);
}