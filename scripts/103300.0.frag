#extension GL_OES_standard_derivatives : enable
precision highp float;
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
struct Ray{
	vec3 origin;
	vec3 direction;
};
 
struct Sphere{
	vec3 center;
	float radius;
	vec3 Color;
};
 
struct Triangle{
	vec3 v0;
	vec3 v1;
	vec3 v2;
	vec3 Color;
};
 
struct Hit{
	bool hit;
	vec3 pos;
	vec3 normal;
	vec3 Color;
	float mag;
};
	
Hit hit_sphere(Sphere s,Ray r);
Hit hit_triangle(Triangle t,Ray r);
 
const int num_of_sphere=2;
const int num_of_triangle=2;

Sphere sphere[num_of_sphere];
Triangle triangle[num_of_triangle];
 
void main(){
  sphere[0]=Sphere(vec3(2.0,0.0,0.0),1.0,vec3(0.8,0.0,0.2));
  sphere[1]=Sphere(vec3(-2.0,0.0,0.0),1.0,vec3(0.8));
  triangle[0]=Triangle(vec3(8.0,-1.0,8.0),vec3(8.0,-1.0,-8.0),vec3(-8.0,-1.0,-8.0),vec3(0.5));
  triangle[1]=Triangle(vec3(8.0,-1.0,8.0),vec3(-8.0,-1.0,-8.0),vec3(-8.0,-1.0,8.0),vec3(0.5));
  float min=min(resolution.x,resolution.y);
  vec2 uv=(gl_FragCoord.xy*2.0-resolution)/min;
  
  vec3 camera=vec3(0.0,1.0,-5.0);
  vec3 cameraDir=normalize(vec3(0.0,0.0,0.1));
  vec3 cameraUp=vec3(0.0,1.0,0.0);
  vec3 cameraSide=cross(cameraDir,cameraUp);
  
  vec3 lightDirection = normalize(vec3(0.0,1.0,1.0));
  vec3 lightColor=vec3(0.2,0.5,1.0);
  vec3 ambientColor=vec3(0.1,0.1,0.1);
  
  float screenZ=1.0;
  
  Ray ray=Ray(camera,normalize(cameraSide*uv.x+cameraUp*uv.y+cameraDir*screenZ));
  
  vec3 Color = vec3(1.0,1.0,1.0);
  for(int i=0;i<4;i++){
    Hit hit;
    hit.hit=false;
    for(int j=0;j<num_of_sphere;j++){
      Hit sphere_hit=hit_sphere(sphere[j],ray);
      if(!hit.hit||(hit.hit&&sphere_hit.hit&&abs(hit.mag)>=abs(sphere_hit.mag)))hit=sphere_hit;
    }
    for(int j=0;j<num_of_triangle;j++){
      Hit triangle_hit=hit_triangle(triangle[j],ray);
      if(!hit.hit||(hit.hit&&triangle_hit.hit&&abs(hit.mag)>=abs(triangle_hit.mag)))hit=triangle_hit;
    }
 
    if (hit.hit) {
      Color = Color*hit.Color;
      ray.direction=normalize(reflect(ray.direction,hit.normal));
      ray.origin=hit.pos+ray.direction*0.0001;
    }else{
      break;
    }
  }
  float z=pow(max(0.0,dot(ray.direction,lightDirection)+1.0)/2.0,2.0);
  gl_FragColor=vec4((lightColor*z+ambientColor)*Color,1.0);
}
 
float lensq(vec3 v){
	return v.x*v.x+v.y*v.y+v.z*v.z;
}
 
Hit hit_sphere(Sphere s, Ray r) {
  Hit hit=Hit(false,vec3(0.0),vec3(0.0),vec3(0.0),1.0);
  vec3 oc = r.origin-s.center;
  float a = lensq(r.direction);
  float half_b =dot(oc,r.direction);
  float c = lensq(oc) - s.radius*s.radius;
  float discriminant = half_b*half_b - a*c;
  
  if (discriminant >= 0.0){
    float t=(-half_b - sqrt(discriminant) ) / a;
    if(t>0.0){
      vec3 pos=r.origin+r.direction*t;
      hit.hit=true;
      hit.pos=pos;
      hit.normal=normalize(pos-s.center);
      hit.Color=s.Color;
      hit.mag=t;
    }
  }
  return hit;
}
 
Hit hit_triangle(Triangle t,Ray r){
  Hit hit;
  hit.hit=false;
  float epsilon = 0.000001;
  vec3 edge1 = t.v1-t.v0;
  vec3 edge2 = t.v2-t.v0;
  
  vec3 P = cross(r.direction,edge2);
  float det = dot(P,edge1);
  if (det >epsilon){
    // uを求める
    vec3 T = r.origin-t.v0;
    float u = dot(P,T);
    if ((u >= 0.0) && (u <= 1.0 * det)){
    // vを求める
    vec3 Q = cross(T,edge1);
    float v = dot(Q,r.direction);
      if ((v >= 0.0) && (u + v <= 1.0 * det)){
        // tを求める
        float t_ = dot(Q,edge2) / det;
        hit.hit=true;
        hit.pos=r.origin+r.direction*t_;
        hit.normal=normalize(cross(edge1,t.v2-t.v1));//TODO:correct normal
        hit.mag=t_;
        hit.Color=t.Color;
      }
    }
  }
  return hit;
}