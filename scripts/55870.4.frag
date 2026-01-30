#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float eps = 1e-6;
struct Ray {
  vec3 origin;
  vec3 direction;
};
struct Sphere {
  vec3 center;
  float radius;
  vec3 color;
};
struct Intersection {
  bool isHit;
  vec3 point;
  vec3 normal_vector;
  float t;
  vec3 color;

};
vec3 tmp = vec3 (0.0, 0.0, 5.0);
vec3 dummy = vec3(0.0,0.0,0.0);
vec3 light = vec3(1.0, 1.0, 1.0);
vec3 shade(Intersection i){
  if(!i.isHit) return vec3(0.0);
  return i.color * clamp(dot(normalize(light), i.normal_vector), 0.0, 1.0);
}
Intersection raySphereIntersection(Ray ray, Sphere s){
  vec3 origin_center = ray.origin - s.center;
  float a = dot(ray.direction,ray.direction);
  float b = dot(ray.direction, ray.origin - s.center);
  float c = dot(origin_center, origin_center) -  s.radius * s.radius;
  float D = b * b - a * c;
  if (D<-eps) {
    return Intersection(false, dummy, dummy, 0.0, dummy);
  }
  float t;
  if(D<eps){ 
    t = -b / a;
  }else {
    float t1 = (-b + sqrt(D)) / a;
    float t2 = (-b - sqrt(D)) / a; 
    t = abs(t1) < abs(t2)?t1 : t2;
  }
  vec3 p = ray.origin + ray.direction * t;
  return Intersection(true, p, normalize(p - s.center), t, s.color);
}
void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	Ray ray  = Ray(tmp, normalize(vec3(p.x, p.y, -1.0)));
	Intersection i = raySphereIntersection(ray, Sphere(vec3(0.0, 0.0, -4.0), 3.0, vec3(1.0)));
	gl_FragColor = vec4( shade(i), 1.0 );

}