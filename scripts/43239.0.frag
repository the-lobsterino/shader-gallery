#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat3 rotx(float a){
  float c=cos(a),s=sin(a);
  return mat3(c,-s,0,s,c,0,0,0,1);
}

mat3 roty(float a){
  float c=cos(a),s=sin(a);
  return mat3(c,0,-s,0,1,0,s,0,c);
}

mat3 rotz(float a){
  float c=cos(a),s=sin(a);
  return mat3(1,0,0,0,c,-s,0,s,c);
}

float cube(vec3 p, vec3 s){
  return length(max(abs(p)-s,0.));
}

float box(vec3 p, vec3 s){
  return max(abs(p.x)-(s.x)/2.,max(abs(p.y)-(s.y)/2.,abs(p.z)-(s.z)/2.));
}

float sphere(vec3 p, float r){
  return length(p)-r;
}

float scene(vec3 p){
  float b = box(p*rotx(time),vec3(2.));
  return b;
}

float trace(){
  return 1.;
}

vec3 normal(vec3 p){
  vec2 e = vec2(0.,0.001);
  float d = scene(p);
  return normalize(vec3(scene(p+e.yxx)-d,scene(p+e.xyx)-d,scene(p+e.xxy)-d));
}

void main( void ) {

	vec2 p = (gl_FragCoord.xy / resolution.xy)*2.0-1.0;
  p.x *= resolution.x / resolution.y;
  
  vec3 camorigin = vec3(2.0);
  vec3 camtarget = vec3(0.0);
  vec3 updir = vec3(0.0,1.0,0.0);
  vec3 camdir = normalize(camtarget-camorigin);
  vec3 camright = normalize(cross(updir,camorigin));
  vec3 camup = cross(camdir,camright);

  vec3 raydir = normalize(camright*p.x+camup*p.y+camdir);

  const int iters = 40;
  const float maxdist = 20.0;
  const float eps = 0.001;

  float totaldist = 0.0;
  vec3 pos = camorigin;
  float dist = eps;

  for(int i = 0; i < iters; i++){
    if(dist<eps || totaldist>maxdist)break;
    dist = scene(pos);
    totaldist += dist;
    pos += dist*raydir;
  }

  vec3 color;
  
  if(dist < eps){
   vec2 e = vec2(0.0, eps);
    vec3 normal = normalize(vec3(
       scene(pos + e.yxx) - scene(pos - e.yxx),
       scene(pos + e.xyx) - scene(pos - e.xyx),
       scene(pos + e.xxy) - scene(pos - e.xxy)));
    float diffuse = max(0.0, dot(-raydir, normal));
    float specular = pow(diffuse, 32.0);
    color = vec3(diffuse+specular);
  }
  else{
    color = vec3(0.0);
  }

  gl_FragColor=vec4(color,1.);

}