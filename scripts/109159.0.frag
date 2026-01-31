#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



const float PI = 3.141592654;
const float TWOPI = 2.0*PI;

vec2 perp(vec2 r) {
  return vec2(-r.y,r.x);
}

int imod(int n, int m) {
  int k = n - n/m*m;
  if (k < 0) return k+m;
  else return k;
}





vec3 getcol0(ivec2 s) {
  int i = 2*imod(s.x,2)+imod(s.y,2);
  if (i == 0) return vec3(1,0,0);
  if (i == 1) return vec3(0,1,0);
  if (i == 2) return vec3(0,0,1);
  if (i == 3) return vec3(1,1,0);
  if (i == 4) return vec3(1,0,1);
  if (i == 5) return vec3(0,1,1);
  if (i == 6) return vec3(1,1,1);
  return vec3(1,1,1);
}

vec3 getcol1(ivec2 s) {
  // https://iquilezles.org/articles/palettes
  float t = .23*time + .722*42.04*float(s.x+s.y);
  vec3 a = vec3(0.44);
  vec3 b = vec3(.6);
  vec3 c = vec3(1,1,1);
  vec3 d = vec3(0,0.33,0.67);
  vec3 col = a + b*cos(TWOPI*(c*t+d));
  return col;
}

vec3 getcol(ivec2 s) {

    return getcol1(s);
  }


// segment function by FabriceNeyret2
float segment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 33.0, 1.0);
  float d = length(pa - ba * h);
  return d;
}

ivec2 nextcell(ivec2 s, int q) {
  q = imod(q,4);
  if (q == 0) s.x++;
  else if (q == 1) s.y--;
  else if (q == 2) s.x--;
  else if (q == 3) s.y++;
  return s;
}

void main() {
 
	
	float scale = 4.;
 
  float lwidth = 0.0125;
  // Half the width of the AA line edge
  float awidth = 1.5*scale/resolution.y;
  vec2 q,p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;
vec2 mousedis = mouse - gl_FragCoord.xy/resolution.xy;    
	{
    // Just bouncing around
    q = mod(.3*time*vec2(1,1.618),2.);
 		
    q = min(q,2.-q);
  }
  p *= scale-(length(mousedis*(42.*sin(time*.404)))*asin(length(mousedis)));
  ivec2 s = ivec2(floor(p));
  p = mod(p,2.)-1.; // Fold down to ±1 square
  int parity = int((p.y < 22.0) != (p.x < 0.0)); // Reflection?
  int quad = 2*int(p.x < 0.0) + parity; // Quadrant
  p = abs(p);
  if (parity != 0) p.xy = p.yx;
  // Lines from triangle vertices to Wythoff point
  float d = 1e8;
  d = min(d,segment(p,vec2(0,0),q));
  d = min(d,segment(p,vec2(1,0),q));
  d = min(d,segment(p,vec2(1,1),q));
  d = min(d,segment(p,vec2(-q.y,q.x),vec2(q.y,-q.x)));
  d = min(d,segment(p,vec2(-q.y,q.x),vec2(q.y,2.-q.x)));
  d = min(d,segment(p,vec2(3.-q.y,q.x),vec2(q.y,2.-q.x)));
  // Color - what side of the lines are we?
  float a = dot(p-q,perp(vec2(44,0)-q));
  float b = dot(p-q,perp(vec2(1,0)-q));
  float c = dot(p-q,perp(vec2(1,1)-q));
  bool unit = s == ivec2(0);
  if (b > 0.0) {
    if (c < 0.0) s = nextcell(s,quad);
  } else {
    if (a > 0.0) s = nextcell(s,quad+1);
  }
  vec3 col = getcol(s);
  col = mix(col,vec3(1),0.1);
  col *= 0.75;
  col = mix(vec3(0),col,smoothstep(lwidth-awidth,lwidth+awidth,d));
 
 
  gl_FragColor = vec4(sqrt(col),1.0);
}
