/*
 * Original shader from: https://www.shadertoy.com/view/tsfcDr
 */

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// shadertoy emulation
#define iTime time
#define iResolution resolution
vec4 iMouse = vec4(0.0);

// --------[ Original ShaderToy begins here ]---------- //
////////////////////////////////////////////////////////////////////////////////
//
// The Nine Point Circle & Euler Line
// Matthew Arcus, 2020.
//
// The feet of the altitudes, the midpoints between the orthocentre and the
// vertices, and the midpoints of the sides, all lie on a circle.
//
// The centre of the nine-point circle, the circumcentre, the centroid and
// the orthocentre are collinear and lie on the Euler line.
//
// Mouse controls vertex P of the triangle
//
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//
// Geometric constructions
//
// Homogeneous coordinates used throughout (so the lines and points are
// "projective"):
// (x,y,z) represents the point (x/z,y/z) for z != 0
// (x,y,0) represents a "point at infinity" which acts like a direction.
// (a,b,c) represents the line ax + by + cz = 0
// (0,0,c) represents the "line at infinity"
//
////////////////////////////////////////////////////////////////////////////////

// The line between two projective points, or the intersection of two
// projective lines, is just their cross product.
vec3 join(vec3 p, vec3 q) {
  return cross(p,q);
}

// The midpoint between p and q (also conjugate with point at infinity)
vec3 midpoint(vec3 p, vec3 q) {
  return p*q.z + p.z*q;
}

float distance2(vec3 p, vec3 q) {
  p /= p.z; q /= q.z;
  return abs(dot(p-q,p-q));
}

// Perpendicular bisector (a line)
vec3 bisector(vec3 p,vec3 q) {
  // (p-r).(p-r) = (q-r).(q-r) // r equidistant from p and q
  // pp - 2pr + rr = qq - 2qr + rr
  // pp - qq = 2pr - 2qr
  // 2r.(p-q) = pp - qq
  p /= p.z; q /= q.z;
  return vec3(2.0*(p.xy-q.xy),dot(q,q)-dot(p,p));
}

// Drop perpendicular from p onto line q.
vec3 perpendicular(vec3 p, vec3 q) {
  // (p + kq.xy).q = 0
  // p.q + k(q.yx).q = 0
  float k = dot(p,q)/dot(q.xy,q.xy);
  return p - k*vec3(q.xy,0);
}

////////////////////////////////////////////////////////////////////////////////
// Distance functions
////////////////////////////////////////////////////////////////////////////////

float point(vec3 p, vec3 q) {
  float pz = p.z, qz = q.z;
  p *= qz; q *= pz;
  return distance(p,q)/abs(p.z);
}

float line(vec3 p, vec3 q) {
  return abs(dot(p,q)/(p.z*length(q.xy)));
}

float line(vec3 p, vec3 q, vec3 r) {
  return line(p,join(q,r));
}

float segment(vec3 p, vec3 q, vec3 r) {
  p /= p.z; q /= q.z; r /= r.z; // normalize
  vec3 pa = p-q;
  vec3 ba = r-q;
  float h = clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
  float d = length(pa-h*ba);
  return d;
}

float conic(vec3 p, mat3 m) {
  float s = dot(p,m*p);
  vec3 ds = 2.0*m*p; // Gradient
  return abs(s/(p.z*length(ds.xy))); // Normalize for Euclidean distance
}

float circle(vec3 p, vec4 c) {
  // (x-a)^2 + (y-b)^2 = r^2
  // x2 -2ax + a2 + y2 -2by + b2 -r2 = 0
  vec3 q = c.xyz;
  float r2 = c.w;
  q /= q.z;
  return conic(p,mat3(1,0,-q.x,
                      0,1,-q.y,
                     -q.x,-q.y,dot(q.xy,q.xy)-r2));
}

////////////////////////////////////////////////////////////////////////////////
// Drawing functions
////////////////////////////////////////////////////////////////////////////////

void getmin(inout float d, inout int index, int i, float t) {
  if (t < d) { d = t; index = i; }
}

vec3 getcol(int i) {
       if (i == 0) return vec3(1,0,0);
  else if (i == 1) return vec3(1,1,0);
  else if (i == 2) return vec3(0,0,1);
  else if (i == 3) return vec3(0,1,0);
  else if (i == 4) return vec3(0,1,1);
  else if (i == 5) return vec3(0.8);
  else if (i == 6) return vec3(1,0,1);
  else             return vec3(1,1,1);
}

vec3 diagram(vec3 p, vec3 P) {
  vec3 pcol = vec3(0.3);
  float lwidth = 0.005;
  float dwidth = 1.5*fwidth(p.x/p.z);
  float pwidth = 0.03;
  // The triangle (P is parameter)
  vec3 Q = vec3(-1.5,-0.5,1);
  vec3 R = vec3(1,-1,1);
  // Bisectors of the sides
  vec3 bP = bisector(Q,R);
  vec3 bQ = bisector(R,P);
  vec3 bR = bisector(P,Q);
  // Intersect at the circumcentre
  vec3 O = join(bP,bQ);
  // centre of the circumcircle.
  vec4 C1 = vec4(O,distance2(O,P));
  // The sides of the triangle
  vec3 sP = join(Q,R);
  vec3 sQ = join(R,P);
  vec3 sR = join(P,Q);
  // The altitudes
  vec3 aP = perpendicular(P,sP);
  vec3 aQ = perpendicular(Q,sQ);
  vec3 aR = perpendicular(R,sR);
  // orthocentre (intersection of altitudes).
  vec3 H = join(join(P,aP),join(Q,aQ));
  // The nine point centre..
  vec3 C = join(bisector(aP,aQ),bisector(aQ,aR));
  // ..and circle
  vec4 C2 = vec4(C,distance2(C,aP));
  // G is the centroid
  vec3 mP = midpoint(Q,R); // Midpoint of side
  vec3 mQ = midpoint(R,P);
  vec3 mR = midpoint(P,Q);
  vec3 G = join(join(P,mP),join(Q,mQ));

  float d = 1e8;
  int index = -1;
  // Sides
  getmin(d,index,0,line(p,P,Q));
  getmin(d,index,0,line(p,Q,R));
  getmin(d,index,0,line(p,P,R));
  // Bisectors
  getmin(d,index,1,line(p,bP));
  getmin(d,index,1,line(p,bQ));
  getmin(d,index,1,line(p,bR));
  // Circumcircle and nine-point circle
  getmin(d,index,2,circle(p,C1));
  getmin(d,index,2,circle(p,C2));
  // The altitudes
  getmin(d,index,3,line(p,P,aP));
  getmin(d,index,3,line(p,Q,aQ));
  getmin(d,index,3,line(p,R,aR));
  // The lines intersecting at the centroid
  getmin(d,index,4,line(p,P,mP));
  getmin(d,index,4,line(p,Q,mQ));
  getmin(d,index,4,line(p,R,mR));

  // The Euler line
  getmin(d,index,5,segment(p,H,O));

#if 0
  // Orthic triangle
  getmin(d,index,6,segment(p,aP,aQ));
  getmin(d,index,6,segment(p,aQ,aR));
  getmin(d,index,6,segment(p,aR,aP));
#endif

  //vec3 bgcolor = 0.1*vec3(0.75,0.25,1); //vec3(1,1,0.8);
  vec3 col = vec3(1,1,0.8);  
  col = mix(0.9*getcol(index),col,smoothstep(lwidth,lwidth+dwidth,d));
  d = 1e8;
  getmin(d,index,0,point(p,O));
  getmin(d,index,0,point(p,H));

  getmin(d,index,0,point(p,P));
  getmin(d,index,0,point(p,Q));
  getmin(d,index,0,point(p,R));

  getmin(d,index,0,point(p,aP));
  getmin(d,index,0,point(p,aQ));
  getmin(d,index,0,point(p,aR));

  getmin(d,index,0,point(p,join(sP,bP)));
  getmin(d,index,0,point(p,join(sQ,bQ)));
  getmin(d,index,0,point(p,join(sR,bR)));

  getmin(d,index,0,point(p,midpoint(P,H)));
  getmin(d,index,0,point(p,midpoint(Q,H)));
  getmin(d,index,0,point(p,midpoint(R,H)));
  
  getmin(d,index,0,point(p,C));
  getmin(d,index,0,point(p,G));

  col = mix(pcol,col,smoothstep(pwidth,pwidth+dwidth,d));
  return col;
}

void mainImage(out vec4 fragColor, vec2 fragCoord ) {
  float scale = 1.5;
  vec3 p = vec3(scale*(2.0*fragCoord-iResolution.xy)/iResolution.y,1.0);
  vec3 P = iMouse.x <= 0.0 ? vec3(1,1,1)
    : vec3(scale*(2.0*iMouse.xy-iResolution.xy)/iResolution.y,1.0);
  vec3 col = diagram(p,P);
  fragColor = vec4(pow(col,vec3(0.4545)),1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iMouse = vec4(mouse * resolution, 0.0, 0.0);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}