#ifdef GL_ES
precision highp float;
#endif


/* AlgebraicSurfaces   modified by I.G.P.
Ray marching for algebraic surface 
with orthographics  projection
Idea from RealSurf (http://realsurf.informatik.uni-halle.de/)
*/

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec4 backColor = vec4(0.14, 0.14, 0.1, 1.0);

// select current function here:
//#define F F1
//#define F F2
//#define F F3
//#define F F4
#define F F5
//#define F F6
//#define F F7

#define R 5.
#define oo 1000.
#define N 5
#define IT 15

float alpha = 2.3+.35*sin(time);

struct listN{
	float[N] a;
};

// surface	
float F1(vec3 v) 
{
  float x = v.x;
  float y = v.y;
  float z = v.z;
  return  x*x*x*x +y*y*y*y +z*z*z*z
	  -8.*x*y*z -1.;	
}

// Cayley Cubic surface
float F2(vec3 v) 
{
  float x = v.x;
  float y = v.y;
  float z = v.z;
  return x*x +y*y +z*z +x*y*z-4.;
}	

float F3(vec3 v) 
{
  float x = v.x;
  float y = v.y;
  float z = v.z;
  float s = x+y+z+1.;
  return (x*x+y*y+z*z-1.)-alpha*x*y*z;
}

// surfer.Helix
// https://imaginary.org/gallery/herwig-hauser-classic
float F4(vec3 v) 
{
  float x2 = v.x*v.x;
  float y2 = v.y*v.y;
  float z2 = v.z*v.z;
  return 6.*x2 -2.*x2*x2 -y2*z2;
}

// surfer.Zeck
// https://imaginary.org/gallery/herwig-hauser-classic
float F5(vec3 v) 
{
  float x2 = v.x*v.x;
  float y2 = v.y*v.y;
  float z2 = v.z*v.z;
  float z4 = v.z*v.z*v.z*v.z;
  //return x2 +y2 -z2*v.z*(3.-v.z);
  return 16.*x2+16.*y2+z4-16.*z2;
}

// surfer.Distel
// https://imaginary.org/gallery/herwig-hauser-classic
float F6(vec3 v) 
{
  float x2 = v.x*v.x;
  float y2 = v.y*v.y;
  float z2 = v.z*v.z;
  return x2 +y2 +z2 +1500. -(x2+y2) *(x2+z2) *(y2+z2) -1.0;
}

// don't work!!!
// Wolf Barths Sextik Surface (1994) with 65 double points
// http://www.holtzbrinck.de/artikel/951590// Bath's Sextic
// https://imaginary.org/program/formula-morph
// http://mathworld.wolfram.com/BarthSextic.html
float F7(vec3 v) 
{
  float f = 3.236068;   // 1+sqrt(5);
  float g = 1.618034;   // golden ratio = (1+sqrt(5))/2
  float k = g*g;        // k = g^2
  float x2 = v.x * v.x;
  float y2 = v.y * v.y;
  float z2 = v.z * v.z;
  float s = x2 +y2 +z2 -1.;	
  return 4.0 *(k*x2-y2) *(k*y2-z2) *(k*z2-x2) -(1.0+f) *s *s;
}

//------------------------------------------
vec3 dF(vec3 v) 
{
  float x = v.x;
  float y = v.y;
  float z = v.z;
  float diff =0.0001;
  float dfx = (F(vec3(x+diff,y,z))-F(vec3(x-diff,y,z)))/(2.*diff);
  float dfy = (F(vec3(x,y+diff,z))-F(vec3(x,y-diff,z)))/(2.*diff);	
  float dfz = (F(vec3(x,y,z+diff))-F(vec3(x,y,z-diff)))/(2.*diff);	
  return vec3(dfx,dfy,dfz ); 
}
//------------------------------------------

float SR(vec3 v) {
  return dot(v,v)-R*R;  
}

vec3 ray(vec2 pos, float t) {
  float th = time*.2-4.*mouse.x;
  float phi = time*.1321+3.*mouse.y;
	
  return 
    mat3(
      vec3(cos(th),0.,sin(th)),
      vec3(0.,1.,0.),
      vec3(-sin(th),0.,cos(th))
    )*
    (
    mat3(
      vec3(1.,0,0.),
      vec3(0,cos(phi),sin(phi)),
      vec3(0,-sin(phi),cos(phi))
    )  
    *(vec3(pos,6.)+vec3(0.,0.,-0.5)*t));
}

  
float eval(listN p, float t) {
	float res = 0.; //horner scheme
	for(int i=N-1; i>=0; i--) {
		res = res*t + p.a[i];
	}
	return res;
}




void d(listN p, out listN r) {
  //listN r;
  for(int i=0; i<N; i++) {
    r.a[i] = p.a[i+1]*float(i+1);  
  }
  r.a[N-1] = 0.;
  //return r;
}


float bisect(listN p, float l, float u, float def) {
  if(l==u) return def;
  float lv = eval(p, l);
  float uv = eval(p, u);
  if(lv*uv>=0.) return def;
  
  float m, mv;
  for(int i=0; i<IT; i++) {
    m = (l+u)/2.;
    mv = eval(p, m);
    if(lv*mv>0.) {
      l = m;
      //lv = mv;
    } else {
      u = m;
      //bv = cv; //nobody cares
    }
  }
  return m;
}

void copy(in listN p, out listN q) {
	for(int i=0; i<N;i++) {
		q.a[i] = p.a[i];	
	}
}


float firstroot2(in listN p0, float l, float u) { 
	listN p1;
	d(p0, p1);

	
	float best = oo;
	
	for(int j=0; j<N+2; j++) {
		float z = l+(u-l)*float(j)/float(N+1);
			float d = 0.;
		for(int i=0; i<IT; i++) { //newton
			d = eval(p0,z)/eval(p1,z);
			z = z - d;
		}
		if(l < z && z < u && z<best && abs(d)<.01) 
			best = z;	
	}
	return best;
}

float firstroot(in listN p0, float l, float u) { //finds first root of listN in interval [l, u]
  listN p[N-1];//derivatives: until linear
  copy(p0, p[0]);
	
  for(int i=1; i<N-1; i++) {
    d(p[i-1], p[i]);
  }

  listN roots, oroots; //better listN
  for(int i=0; i<N; i++) roots.a[i] = oroots.a[i] = u;
	
  for(int i=N-2; i>=0; i--) { //i: numer of derivatives
    roots.a[0] = bisect(p[i], l, oroots.a[0], l);
    for(int j=1; j<N; j++) { if(j+i<N-1)
      roots.a[j] = bisect(p[i], oroots.a[j-1], oroots.a[j], roots.a[j-1]);
    }
    copy(roots, oroots);
  }

  for(int i=0; i<4; i++) {
    if(roots.a[i]!=l && roots.a[i]!=u) return roots.a[i];
    //if(abs(eval(listN,roots[i]))<.01) return roots[i];
  }
  return oo;
}

void initL(in float a0, in float a1, in float a2, in float a3, out listN a) {
  a.a[0] = a0;
  a.a[1] = a1;
  a.a[2] = a2;
  a.a[3] = a3;
}

void initL(in float a0, in float a1, in float a2, in float a3, in float a4, out listN a) {
  a.a[0] = a0;
  a.a[1] = a1;
  a.a[2] = a2;
  a.a[3] = a3;
  a.a[4] = a4;
}

listN A[N];

//asume basepoints 0, 5, 10, 15
void interpolate(in listN vals, out listN p) {
    for(int i=0; i<N; i++) p.a[i] = 0.;
    for(int i=0; i<N; i++) {
      for(int j=0; j<N; j++)
        p.a[i] += A[j].a[i]*vals.a[j];
    }
}


void main( void ) 
{
  if(N==4)
  { // octave: inv(fliplr(vander([0,5,10,15])))'
    initL(  1.000000000000000, -0.366666666666667,  0.040000000000000, -0.001333333333333, A[0]);
    initL( -0.000000000000000,  0.600000000000000, -0.100000000000000,  0.004000000000000, A[1]);
    initL(  0.000000000000000, -0.300000000000000,  0.080000000000000, -0.004000000000000, A[2]);
    initL( -0.000000000000000,  0.066666666666667, -0.020000000000000,  0.001333333333333, A[3]);
  } 
  else if(N==5)
  {  // 0 4 8 12 16
    initL(  1.000000000000000, -0.520833333333333,  0.091145833333333, -0.006510416666667,  0.000162760416667, A[0]);
    initL(  0.000000000000000,  1.000000000000000, -0.270833333333333,  0.023437500000000, -0.000651041666667, A[1]);
    initL(  0.000000000000000, -0.750000000000000,  0.296875000000000, -0.031250000000000,  0.000976562500000, A[2]);
    initL(  0.000000000000000,  0.333333333333333, -0.145833333333333,  0.018229166666667, -0.000651041666667, A[3]);
    initL( -0.000000000000000, -0.062500000000000,  0.028645833333333, -0.003906250000000,  0.000162760416667, A[4]);
  }

  vec2 pos = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y)*6.;
  
  listN vals;
  listN rvals;
  for(int i=0; i<N; i++)
  {
    vec3 p = ray(pos, 4.*float(i));
    vals.a[i] = F(p);
    rvals.a[i] = SR(p);
  }
  
  listN poly, rpoly;
  interpolate(vals,  poly);
  interpolate(rvals, rpoly);
  
  // rpoly is quadratic
  float D = (rpoly.a[1]*rpoly.a[1])-4.*rpoly.a[2]*rpoly.a[0]; 
  float froot = oo;
  if(D >= 0.) 
  {
    froot = firstroot(poly, max(0.,(-rpoly.a[1]-sqrt(D))/(2.*rpoly.a[2])), max(0.,(-rpoly.a[1]+sqrt(D))/(2.*rpoly.a[2])));
    //froot = (-rpoly.a[1]-sqrt(D))/(2.*rpoly.a[2]);
  }
  gl_FragColor = backColor;
  
  if(froot != oo) 
  {
    vec3 n = normalize(dF(ray(pos,froot)));
    
    vec3 l[5]; //position of light
    l[0] = vec3(-1.,1.,0.);
    l[1] = vec3(0.,-1.,1.);
    l[2] = vec3(1.,0.,-1.);
    l[3] = -ray(vec2(.0,.0),-10.);
    l[4] = ray(vec2(.0,.0),-10.);
    
    vec3 c[5]; //color of light
    c[0] = vec3(1.,.6,.3)*.6;
    c[1] = vec3(.3,1.,.6)*.6;
    c[2] = vec3(.6,.3,1.)*.6;
    c[3] = vec3(.9,.3,.0);
    c[4] = vec3(0.,.8,.8);
    
    gl_FragColor = vec4(0.,0.,0.,1.);
    
    for(int i=0; i<5; i++) 
    {
      float illumination = max(0.,dot(normalize(l[i]),n));
      gl_FragColor.rgb += illumination*illumination*c[i];
    }
  } 
}
