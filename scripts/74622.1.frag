/*
 * Original shader from: https://www.shadertoy.com/view/ssc3Dn
 */

// Clifford torus (in R4)
// The Clifford torus is the intersection of the hypersurface x^2+y^2=S^2 with
// the unit hypersphere x^2+y^2+z^2+w^2 = 1, so it also satisfies z^2+w^2=s^2 where
//  S^2+s^2 = 1.
//
// Stereographic projection to R3 (from eg. (0,0,0,1)) gives a normal R3
// torus with radii R and r, where S = 1/R and s = r/R, so R = 1/S and
// r = s/S and R^2 = r^2+1:
//
// The projection is equivalent to inversion in a sphere, radius^2 = 2,
// centre (0,0,0,-1) so points (S,0,0,-s) and (S,0,0,s) project to 
// (X,0,0) and (Y,0,0) on the x-axis, where X = S/(1-s),0,0) Y = S/(1+s),
// and (X+Y)/2 = R and (X-Y)/2 = r where R & r are major and minor
// axes of the R3 torus. Some algebra shows that S = 1/R, s = r/R and
// we have the requirement that R^2 = 1+r^2 to ensure the projection
// lies on the hypersphere, but the R3 torus can be scaled to R' = tR 
// and r' = tr, for some t to ensure this is true.
//
// If we want particular proportions between S and s, with eg.
// s/S = M/N, so r = M/N, R = (r^2+1) are the required dimensions.

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

#define time sin(time*surfacePosition.x*surfacePosition.y)

// -----------------------------------------------

// but what the question is what happens inside a 2d slice of a 4d%2d?

uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI =  3.141592654;
//const float PI = 3.1415926;
const float TAU = 2.0 * PI;

float fn(vec2 p)
{
	float t = p.y * resolution.x + p.x;
	float a = gl_FragCoord.y * resolution.x + gl_FragCoord.x;
	float m = a / (p.x*p.y);
	m = cos( floor( t + (m) * (TAU * time) - TAU * (p.x-p.y)) + (a));
	return fwidth(abs(m));	
}

// -----------------------------------------------

// Debug
bool alert = false;

void assert(bool t) {
  if (!t) alert = true;
}

bool eq(float x, float y) {
  return abs(x-y) < 1e-4;
}

bool eq(vec4 p, vec4 q) {
  return eq(p.x,q.x) && eq(p.y,q.y) && eq(p.z,q.z) && eq(p.w,q.w);
}

bool eq(mat4 m, mat4 n) {
  return eq(m[0],n[0]) && eq(m[1],n[1]) && eq(m[2],n[2]) && eq(m[3],n[3]);
}

vec2 rotate(vec2 p, float t) {
  return p * cos(t) + vec2(p.y, -p.x) * sin(t);
}

float evalquadratic(float x, float A, float B, float C) {
  return (A*x+B)*x+C;
}

float evalcubic(float x, float A, float B, float C, float D) {
  return ((A*x+B)*x+C)*x+D;
}

float sgn(float x) {
  return x < 0.0 ? -1.0: 1.0; // Return 1 for x == 0
}

// Quadratic solver from Kahan
int quadratic(float A, float B, float C, out vec2 res) {
  float b = -0.5*B, b2 = b*b;
  float q = b2 - A*C;
  if (q < 0.0) return 0;
  float r = b + sgn(b)*sqrt(q);
  if (r == 0.0) {
    res[0] = C/A;
    res[1] = -res[0];
  } else {
    res[0] = C/r;
    res[1] = r/A;
  }
  return 2;
}

// Numerical Recipes algorithm for solving cubic equation
int cubic(float a, float b, float c, float d, out vec3 res) {
  if (a == 0.0) {
    return quadratic(b,c,d,res.xy);
  }
  if (d == 0.0) {
    res.x = 0.0;
    return 1+quadratic(a,b,c,res.yz);
  }
  float tmp = a; a = b/tmp; b = c/tmp; c = d/tmp;
  // solve x^3 + ax^2 + bx + c = 0
  float Q = (a*a-3.0*b)/9.0;
  float R = (2.0*a*a*a - 9.0*a*b + 27.0*c)/54.0;
  float R2 = R*R, Q3 = Q*Q*Q;
  if (R2 < Q3) {
    float X = clamp(R/sqrt(Q3),-1.0,1.0);
    float theta = acos(X);
    float S = sqrt(Q); // Q must be positive since 0 <= R2 < Q3
    res[0] = -2.0*S*cos(theta/3.0)-a/3.0;
    res[1] = -2.0*S*cos((theta+2.0*PI)/3.0)-a/3.0;
    res[2] = -2.0*S*cos((theta+4.0*PI)/3.0)-a/3.0;
    return 3;
  } else {
    float alpha = -sgn(R)*pow(abs(R)+sqrt(R2-Q3),0.3333);
    float beta = alpha == 0.0 ? 0.0 : Q/alpha;
    res[0] = alpha + beta - a/3.0;
    return 1;
  }
}

float qcubic(float B, float C, float D) {
  vec3 roots;
  int nroots = cubic(1.0,B,C,D,roots);
  // Sort into descending order
  if (nroots > 1 && roots.x < roots.y) roots.xy = roots.yx;
  if (nroots > 2) {
    if (roots.y < roots.z) roots.yz = roots.zy;
    if (roots.x < roots.y) roots.xy = roots.yx;
  }
  // And select the largest
  float psi = roots[0];
  // There _should_ be a positive root, but sometimes the cubic
  // solver doesn't find it directly (probably a double root
  // around zero).
  if (psi < 0.0) assert(evalcubic(psi,1.0,B,C,D) < 0.0);
  // If so, nudge in the right direction
  psi = max(1e-6,psi);
  // and give a quick polish with Newton-Raphson
  for (int i = 0; i < 3; i++) {
    float delta = evalcubic(psi,1.0,B,C,D)/evalquadratic(psi,3.0,2.0*B,C);
    psi -= delta;
  }
  return psi;
}

// The Lanczos quartic method
int lquartic(float c1, float c2, float c3, float c4, out vec4 res) {
  float alpha = 0.5*c1;
  float A = c2-alpha*alpha;
  float B = c3-alpha*A;
  float a,b,beta,psi;
  psi = qcubic(2.0*A-alpha*alpha, A*A+2.0*B*alpha-4.0*c4, -B*B);
  psi = max(0.0,psi);
  a = sqrt(psi);
  beta = 0.5*(A + psi);
  if (psi <= 0.0) {
    b = sqrt(max(beta*beta-c4,0.0));
  } else {
    b = 0.5*a*(alpha-B/psi);
  }
  int resn = quadratic(1.0,alpha+a,beta+b,res.xy);
  vec2 tmp;
  if (quadratic(1.0,alpha-a,beta-b,tmp) != 0) { 
    res.zw = res.xy;
    res.xy = tmp;
    resn += 2;
  }
  return resn;
}

int quartic(float A, float B, float C, float D, float E, out vec4 roots) {
  int nroots;
  // Solve for the smallest cubic term, this seems to give the least wild behaviour.
  if (abs(B/A) < abs(D/E)) {
    nroots = lquartic(B/A,C/A,D/A,E/A,roots);
  } else {
    nroots = lquartic(D/E,C/E,B/E,A/E,roots);
    for (int i = 0; i < 1/*nroots*/; i++) {
      roots[i] = 1.0/roots[i];
    }
  }
  assert(nroots == 0 || nroots == 2 || nroots == 4);
  return nroots;
}

vec3 h2rgb(float h) {
  vec3 rgb = clamp( abs(mod(h*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
  return rgb*rgb*(3.0-2.0*rgb); // cubic smoothing	
}

float torus_r, torus_R; // R3 torus dimensions
float N = 16.0, M = 17.0; // Subdivisions for xy and zw torus components


vec3 getcolor(vec3 p3) {
  float R = torus_R, r = torus_r;

  // Find scaling factor.
  // (1+k^2*r^2)/(k^2*R^2) = 1  k^2 = 1/(R^2-r^2)
  float k = sqrt(1.0/(R*R-r*r)); // Scale factor
  R *= k; r *= k; p3 *= k;       // Rescale
  float S = 1.0/R, s = r/R;      // Clifford torus radii

  // Invert to hyperspace, ie. do an inverse stereographic projection,
  // equivalent to inverting in sphere, radius? = 2, centre (0,0,0,-1).
  // This is also the forward projection from R4 to R3.
  vec4 p = vec4(p3,0);
  p.w += 1.0; 
  p *= 2.0/dot(p,p);
  p.w -= 1.0;

  // Find coordinates on R4 torus
  float phi = atan(p.x,p.y)/(2.0*PI);
  float theta = atan(p.z,p.w)/(2.0*PI);
  if (phi < 0.0) phi += 1.0;
  if (theta < 0.0) theta += 1.0;
  vec2 uv = vec2(phi,s*theta/S); // Scale by Clifford radii
  uv *= N * 1.0; // Subdivide
  vec2 uv2 = floor(uv);
  uv -= uv2;
  uv -= 0.5; // Centre cell
	
	uv*=surfacePosition;
	return vec3(uv,fn(fract(uv)));
	
  float l = length(uv), d = 0.8*fwidth(l);
  
  float rnd = fract(sin(uv2.x*12.99+uv2.y*800.+40.)*51343.);
  vec3 color = h2rgb(rnd);

  /*if (!key(CHAR_T))*/ color = mix(color,vec3(0),smoothstep(-d,d, l-0.4 )); // AA by Fabrice
  return color;
}

// R3 torus intersection and normal
int torus(vec3 P, vec3 d, out vec4 res) {
  // Parametrization of the torus by phi and theta angles.
  // x = (R+r*cos(theta))*cos(phi)
  // y = (R+r*cos(theta))*sin(phi)
  // z = r*sin(theta)
    
  // U*t^2 + V*t + W = 2*r*R*cos(theta)
  float U = 1.0; //dot(d,d);
  float V = 2.0*dot(P,d);
  float W = dot(P,P) - (torus_R*torus_R+torus_r*torus_r);
    
  // A*t^4 + B*t^3 + C*t^2 + D*t + E = 0
  float A = 1.0; //U*U;
  float B = 2.0*U*V;
  float C = V*V + 2.0*U*W + 4.0*torus_R*torus_R*d.z*d.z;
  float D = 2.0*V*W + 8.0*torus_R*torus_R*P.z*d.z;
  float E = W*W + 4.0*torus_R*torus_R*(P.z*P.z-torus_r*torus_r);

  int n = quartic(1.0,B,C,D,E,res); // A == 1.0
  return n;
}

vec3 torusnormal(vec3 p) {
  float k = torus_R/length(p.xy);
  p.xy -= k*p.xy;
  return normalize(p);
}

//int AA = 1;

// Lighting
vec3 light;
float ambient;
float diffuse;
float specular = 0.4;
float specularpow = 4.0;
vec3 specularcolor = vec3(1);

vec3 applylighting(vec3 baseColor, vec3 p, vec3 n, vec3 r) {
  if (dot(r,n) > 0.0) n = -n; // Face forwards
  vec3 c = baseColor*ambient;
  c += baseColor*diffuse*(max(0.0,dot(light,n)));
  float s = pow(max(0.0,dot(reflect(light,n),r)),specularpow);
  c += specular*s*specularcolor;
  return c;
}

struct Result {
  vec3 p;
  vec3 n;
  vec3 color;
  float t;
};

bool solve(vec3 p0, vec3 r, float tmin, inout Result result) {
  vec4 roots;
  int nroots = torus(p0,r,roots);
  // Find smallest root greater than tmin.
  float t = result.t;
  for (int i = 0; i < 4; i++) {
    if (i == nroots) break;
    if (roots[i] > tmin && roots[i] < t) {
      vec3 p = p0+roots[i]*r;
      t = roots[i];
    }
  }
  if (t == result.t) return false;
  vec3 p = p0 + t*r;
  vec3 n = torusnormal(p);
  if (dot(n,r) > 0.0) n = -n;
  vec3 basecolor = getcolor(p);
  result.p = p; result.n = n; result.color = applylighting(basecolor,p,n,r);
  return true;
}

vec3 scene(vec3 p, vec3 r) {
  vec3 color = vec3(0);
  float attenuation = 1.0;
  for (int i = 0; i < 6; i++) {
    // Solve from closest point to origin.
    // This makes p.r = 0.
    float tmin = -dot(p,r);
    p += tmin*r;
    Result res = Result(vec3(0),vec3(0),vec3(0),1e8);
    if (!solve(p,r,-tmin,res)) break;
    if (true) return res.color;
    color += attenuation*res.color;
    attenuation *= 0.5;
    p = res.p;
    r = reflect(r,res.n);
    p += 0.001*r;
  }
  return color + attenuation*pow(abs(r),vec3(2));
}

vec3 transform(in vec3 p) {

    vec2 m = mouse * 2.0 - 1.0;
    float theta = (2.0*m.y-1.)*PI;
    float phi = (2.0*m.x-1.)*PI;
    p.yz = rotate(p.yz,theta);
    p.zx = rotate(p.zx,-phi);



    float t = time;
    //t += 3.5;
    p.yz = rotate(p.yz, 0.1*t);
    p.zx = rotate(p.zx, 0.222*t);

  return p;
}


void main(void)
{

  // Set torus parameters
  torus_r = M/N;
  torus_R = sqrt(torus_r*torus_r+1.0);
  
  light = vec3(1,1,-1);
  ambient = 0.4;
  diffuse = 1.0-ambient;
  specular = 0.8;
  specularpow = 10.0;

  float camera = 2.0;
  vec3 p = vec3(0.0, 0.0, -camera);
  p = transform(p);
  light = transform(light);
  light = normalize(light);
  vec3 color = vec3(0);

  #define AA 1

  for (int i = 0; i < AA; i++) {
     for (int j = 0; j < AA; j++) {
       vec2 uv = surfaceSize*surfacePosition.xy*(2.0*(gl_FragCoord.xy+vec2(i,j)/float(AA)) - resolution.xy)/resolution.y;
       vec3 r = normalize(vec3(uv, 2.0));
       r = transform(r);
       r = normalize(r);
       color += scene(p,r);
     }
  }
  color /= float(AA*AA);
  color = pow(color,vec3(0.4545));
  if (alert) color = vec3(1.0,0,0);
  gl_FragColor = vec4(color,1);
}
