#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Coffee_And_Milk.glsl

#define brown vec3(0.8, 0.55, 0.2)


float map(vec3 p)
{    
  vec3 q = fract(p * 0.5) * 2.0 - 1.0;
  q.y = q.x * 0.5;
  return length(q) - 0.3;
}

float trace(vec3 origin, vec3 ray) 
{    
  float t = 0.0;
  for (int i = 0; i < 18; i++) 
  {
    vec3 p = origin + ray * t;
    float d = map(p);
    t += d * 0.5;
  }
  return t;
}

mat2 rotate2d (float angle)    // create 2d rotation matrix
{
  float ca = cos(angle),  sa = sin(angle);    
  return mat2(ca, -sa, sa, ca);
}


void main( void ) 
{
  float time = time * 0.1;
	
  vec2 uv = gl_FragCoord.xy / resolution.xy;  // position  
  uv = uv * 2.0 - 1.0;                        // center  
  uv.x *= resolution.x / resolution.y;        // aspect ratio                    
  vec3 color = vec3(0);                       // RGB
  float s1 = sin(time * 1.5);
    
  // Compute RGB separately.
  for (int i = 0; i < 3; i++) 
  {
    vec3 origin = vec3(0.0, 0.0, time);         // Move origin
    vec3 ray = normalize(vec3(uv, 0.5));
    ray.xy *= rotate2d(time+length(uv)*s1*6.);  // Spiral rotation (XY)
    ray.xz *= rotate2d(time*2.);                // Normal rotation (XZ).
    float t = trace(origin, ray);
    color[i] = 1.0 / (1.0 + t * t * 0.07);      // Visualize depth
  }    
  gl_FragColor = vec4(color * brown, 1.0);
}