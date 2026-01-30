precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159

struct Ray{
  vec3 origin;
  vec3 direction;
};

struct Hit{
  float t;
  vec3 pos;
  vec3 norm;
  vec3 color;
  int surface;
};

struct Sphere{
  vec3 center;
  float radius;
  vec3 color;
  int surface;
};

struct Triangle{
  vec3 vert0;
  vec3 vert1;
  vec3 vert2;
  vec3 color;
  int surface;
};

struct Objects{
  Triangle t[4];
  Sphere   s[4];
} obj;

struct Light{
  vec3 pos;
  float power;
};

float quadric_discriminant(float a, float b, float c){
  return b*b-4.0*a*c;
}

vec2 solve_quadric(float a, float b, float c){
  return (vec2(-b) + sqrt(quadric_discriminant(a,b,c)) * vec2(-1.0,1.0)) / (2.0 * a);
}

float det(mat3 m){
  return dot(cross(m[0],m[1]),m[2]);
}

Hit hit(Ray ray, Sphere sphere){
  /*
    return distance from ray_source to hit point if ray hits sphere
    otherwise return -1
   */
  float t = -1.0;
  float a = dot(ray.direction, ray.direction);
  float b = 2.0*dot(ray.direction, ray.origin-sphere.center);
  float c = dot(ray.origin-sphere.center, ray.origin-sphere.center) -
    sphere.radius*sphere.radius;
  float disc = quadric_discriminant(a,b,c);

  if(disc > 0.0){
    vec2 roots = solve_quadric(a,b,c);
    if(roots[0] > 0.0) t = roots[0];
    else if(roots[1] > 0.0) t = roots[1];
  }
  vec3 pos = ray.origin+t*ray.direction;
  vec3 n = normalize(pos-sphere.center);
  if(dot(n, ray.direction) > 0.0) n = -n;

  return Hit(t,pos,n,sphere.color,sphere.surface);
}

Hit hit(Ray ray, Triangle triangle){
  /*
    return distance from ray_source to hit point if ray hits triangle
    otherwise return -1
   */
  mat3 A = mat3(triangle.vert0 - triangle.vert1,
                triangle.vert0 - triangle.vert2,
                ray.direction);
  vec3 b = triangle.vert0 - ray.origin;
  float d = det(A);
  float beta = det(mat3(b,A[1],A[2])) / d;
  float gamma = det(mat3(A[0],b,A[2])) / d;
  float t = det(mat3(A[0],A[1],b)) / d;
  float alpha = 1.0 - beta - gamma;
  vec3 n = vec3(0.0);

  if(0.0 <= t && 0.0 <= alpha && alpha <= 1.0 &&
     0.0 <= beta && beta <= 1.0 && 0.0 <= gamma && gamma <= 1.0){
    n = normalize(cross(triangle.vert1-triangle.vert0, triangle.vert2-triangle.vert0));
    if(dot(n, ray.direction) > 0.0) n = -n;
  }
  else{
    t = -1.0;
  }
  vec3 pos = ray.origin + t*ray.direction;
  return Hit(t, pos, n, triangle.color, triangle.surface);
}

void main(void){
  vec3 color = vec3(0);

  //define camera and film
  vec3 camera = vec3(15.0,5.0,0);
  vec3 up = vec3(0,1.0,0);
  vec3 film_center = vec3(70.0,0,0);
  float film_width = 150.0;
  vec2 film_size = vec2(film_width,film_width*resolution.y/resolution.x);

  //define pixel coordinate and ray from pixel
  vec3 w = normalize(film_center - camera);
  vec3 u = normalize(cross(up, w));
  vec3 v = cross(w,u);
  vec3 film_coord = vec3(film_size.x * 2.0 * (gl_FragCoord.x / resolution.x - 0.5),
                         film_size.y * 2.0 * (gl_FragCoord.y / resolution.y - 0.5),
                         distance(camera,film_center));
  vec3 pixel = mat3(u,v,w) * film_coord + camera;
  vec3 origin = camera;
  vec3 direction = normalize(camera - pixel);
  Ray ray = Ray(origin, direction);

  // define objects
  for(int i=0; i<4; i++){
    obj.s[i] = Sphere(vec3(0.0), 0.0, vec3(0.0),0);
    obj.t[i] = Triangle(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0), 0);
  }

  obj.s[0] = Sphere(vec3(-5.0,3.0,7.0), 4.0,
                    vec3(1.0,0.0,0.0), 0);

  obj.s[1] = Sphere(vec3(2.0,8.0,-6.0), 2.0,
                    vec3(1.0,1.0,0.0), 0);

  obj.t[0] = Triangle(vec3( 10.0, 10.0, 10.0),
                      vec3(-10.0, 10.0,-10.0),
                      vec3( 10.0, 10.0,-10.0),
                      vec3(1.0,1.0,1.0), 0);
  obj.t[1] = Triangle(vec3( 10.0, 10.0, 10.0),
                      vec3(-10.0, 10.0, 10.0),
                      vec3(-10.0, 10.0,-10.0),
                      vec3(1.0,1.0,1.0),0);
  obj.t[2] = Triangle(vec3( 10.0,-10.0, 10.0),
                      vec3( 10.0,-10.0,-10.0),
                      vec3(-10.0,-10.0,-10.0),
                      vec3(1.0,1.0,1.0),0);
  obj.t[3] = Triangle(vec3(-10.0,-10.0, 10.0),
                      vec3( 10.0,-10.0, 10.0),
                      vec3(-10.0,-10.0,-10.0),
                      vec3(1.0,1.0,1.0),0);

  Light light = Light(vec3(0.0), 400.0);
  float amb = 0.1;

  float t = 1e10;
  Hit h = Hit(-1.0,vec3(0.0),vec3(0.0),vec3(0.0),0);
  for(int i=0; i<4; i++){
    Hit tmp = hit(ray, obj.t[i]);
    float ti = tmp.t;
    if(0.0 < ti && ti < t){
      t = ti;
      h = tmp;
    }
    tmp = hit(ray, obj.s[i]);
    ti = tmp.t;
    if(0.0 < ti && ti < t){
      t = ti;
      h = tmp;
    }
  }
  float d = distance(light.pos, h.pos);
  float dotp = dot(h.norm, normalize(light.pos-h.pos));
  dotp = dotp > 0.0 ? dotp : 0.0;
  color = h.color *
    (light.power * dotp /
     (4.0 * PI * d * d) * (1.0 - amb)
     + amb);

  gl_FragColor = vec4(color, 1.0);

}
	