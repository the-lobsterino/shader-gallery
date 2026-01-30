
//---------------------------------------------------------
// Shader:   FresnelLikeSurface.glsl                 4/2015
//           http://glslsandbox.com/e#24817.0
// tags:     fresnel, surface, 2d, raymarcher
// info:     http://mathworld.wolfram.com/FresnelsElasticitySurface.html
//---------------------------------------------------------

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define NEAR 0.01
#define FAR 10.
#define STEPS 111
#define RADIUS 1.8

float tv;  // time value

// get 3d function value
float map(vec3 p) 
{
  return length(p) -RADIUS + 0.2*sin(time)
	  + 0.2 * cos(8.0 * p.x + tv) 
	  + 0.2 * cos(8.0 * p.y + tv*0.5);
}

// get surface normal
vec3 normal(vec3 p) 
{
  vec2 q = vec2(0.0, 0.02);
  float v = map(p);
  return normalize(vec3( map(p + q.yxx) - v,
                         map(p + q.xyx) - v,
                         map(p + q.xxy) - v ));
}

// get shading color
vec3 shade(vec3 ro, vec3 rd, float t) 
{
  vec3 n = normal(ro +  t * rd);
  float dif = dot(vec3(1.), n);
  return vec3( 0.53, 0.04, 0.36) * dif;
}

// get intersection z distance
float intersect (vec3 ro, vec3 rd)
{
  float t = -ro.z;
  for( int i=0; i < STEPS; i++ ) 
  {
    float d = map(ro + t * rd);
    if (d < NEAR || d > FAR) break;
    t += d*0.5;
  }
  return t;
}

void main( void ) 
{
  vec2 uv = (2.0*gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
  vec3 ro = vec3(0.0, 0.0, 2.5);
  vec3 rd = normalize(vec3(uv*3.0, -1.0));
  
  vec3 col = mix(vec3(0.0), vec3(.4,.4+sin(time)*0.05, 0.14+cos(time)*0.05), 1.25 - length(uv));
	
  tv = 2.5*time;
	
  float t = intersect(ro, rd);
  if (t < FAR) col = shade(ro,rd,t);

  col = pow(col, vec3(.6));
  gl_FragColor = vec4(col, 1.);

}