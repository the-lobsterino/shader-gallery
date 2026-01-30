#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

vec2  p0    = vec2(0.0, 0.0);
vec2  p1    = vec2(0.0, 0.0);
vec4  black = vec4(0.0, 0.0, 0.0, 1.0);
vec4  white = vec4(.5, 0.0, 1.0, 1.0);

float dist_segment(vec2 p, vec2 v, vec2 w) {
  // Return minimum distance between line segment vw and point p
  float l2 = length(w - v);  // i.e. |w-v|^2 -  avoid a sqrt
  l2 *= l2;
	
  if (l2 == 0.0) return distance(p, v);   // v == w case
  // Consider the line extending the segment, parameterized as v + t (w - v).
  // We find projection of point p onto the line. 
  // It falls where t = [(p-v) . (w-v)] / |w-v|^2
  // We clamp t from [0,1] to handle points outside the segment vw.
  float t = clamp(dot(p - v, w - v) / l2, 0.0, 1.0);
  vec2 projection = v + t * (w - v);  // Projection falls on the segment
  return distance(p, projection);
}

void main( void ) {
 vec2  p  = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x,resolution.y);
 vec2  aspect = resolution / min(resolution.x, resolution.y);
       p1 = (2.0 * mouse - 1.0) * aspect;
 float d  = dist_segment(p, p0, p1);
 float th = 0.001;
 float bl = 2.0 * max(1. / resolution.x, 1. / resolution.y);

 if(d > (th + bl))
  discard;

 if(d > th)
  d = mix(0., 1., smoothstep(th, th + bl, d));
	
 gl_FragColor = mix(white, black, d);
}