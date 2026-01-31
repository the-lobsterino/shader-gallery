// 


#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

//float t = time/10.0;
float pi=atan(1.0)*4.0;
float t = (mouse.x-0.5)*2.0*pi;

//#define COLOR
//#define VECTOR
#define CURVES

#if 0
mat2 complex(float zr, float zi)
{
   return mat2(zr,zi,-zi,zr);
}

mat2 complexp(float zl, float zp)
{
   return complex(zl*cos(zp),zl*sin(zp));
}


float RZ(mat2 z)
{
   return z[0][0];
}

float IZ(mat2 z)
{
   return z[0][1];
}

float LZ(mat2 z)
{
   float x = RZ(z);
   float y = IZ(z);
   return sqrt(x*x+y*y);
}

float PZ(mat2 z)
{
   float x = RZ(z);
   float y = IZ(z);
   return atan(y,x);
}

mat2 cdiv(mat2 z1, mat2 z2)
{
   float x2 = RZ(z2);
   float y2 = IZ(z2);
   float l2sq = x2*x2+y2*y2;
   mat2 inv_z2 = complex(x2/(l2sq),-y2/(l2sq));
   return z1*inv_z2;
}

mat2 CZ(mat2 z)
{
   return complex(RZ(z),-IZ(z));
}

mat2 CE = mat2(1.0,0.0,0.0,1.0);
mat2 CI = mat2(0.0,1.0,-1.0,0.0);

float sinh(float x)
{
   return 0.5*exp(-x)-0.5*exp(x);
}
float cosh(float x)
{
   return 0.5*exp(-x)+0.5*exp(x);
}
mat2 ccos(mat2 z)
{
   float x = RZ(z);
   float y = IZ(z);
   return cos(x)*cosh(y)*CE+sin(x)*sinh(y)*CI;
}
mat2 csin(mat2 z)
{
   float x = RZ(z);
   float y = IZ(z);
   return sin(x)*cosh(y)*CE-cos(x)*sinh(y)*CI;
}
mat2 ctan(mat2 z)
{
	return cdiv(csin(z),ccos(z));
}
mat2 cexp(mat2 z)
{
   float x = RZ(z);
   float y = IZ(z);
   return exp(x)*(cos(y)*CE+sin(y)*CI);
}
mat2 cln(mat2 z)
{
   float x = RZ(z);
   float y = IZ(z);
   return complex(0.5*log(x*x+y*y),atan(y,x));
}
mat2 cpow(mat2 z, mat2 w)
{
   return cexp(w*cln(z));
}
mat2 csqrt(mat2 z)
{
   return cpow(z,CE*0.5);
}
mat2 csinh(mat2 z)
{
   return cexp(-z)*0.5-cexp(z)*0.5;
}
mat2 ccosh(mat2 z)
{
   return cexp(-z)*0.5+cexp(z)*0.5;
}
mat2 ctanh(mat2 z)
{
	return cdiv(csinh(z),ccosh(z));
}
mat2 catan(mat2 z)
{
   return (cln(CE-z*CI)-cln(CE+z*CI))*CI*0.5;
}
mat2 cacos(mat2 z)
{
	return cln(z+cpow(z*z-CE,CE*0.5))*(-CI);
}
mat2 cabs(mat2 z)
{
   return complex(abs(RZ(z)),abs(IZ(z)));
}

mat2 cfun(mat2 z)
{
	mat2 w = z;
	w = w*cexp(CI*t);
	return w;
}
#endif

#define CELL_SIZE 12.0

float Ex(float x, float y)
{
	float ex = 1.0;
	ex = x*(x*x+y*y-1.0);
	return ex;
}
float Ey(float x, float y)
{
	float ey = 1.0;
	//float a = 2.0*(mouse.x-0.5);
	//float a = sin(time/4.0);
	//ey = sqrt(1.0-y*y);
	//ey = -1.0-y*y*a;
	//ey = 1.0/(1.0+y*y);
	ey = y*(x*x+y*y+1.0);
	return ey;
}
float fun(float x, float y)
{
	float f = 0.0;
	f=atan(Ey(x,y),Ex(x,y))/pi;
   	return f;
}

float curve(float x, float y, float cc)
{
	float f = 1.0;
	float a = 2.0*(mouse.x-0.5);
	//float a = sin(time/4.0);
	//f = asin(y)-x-cc;
	f = atan(x*x-y*y-1.0,2.0*x*y)-cc + mod(time,1.5);
	return f;
}
float curve2(float x, float y, float cc)
{
   	float f = 1.0;
	float a = 2.0*(mouse.x-0.5);
	//float a = sin(time/4.0);
	float xy2 = x*x+y*y;
	f = 0.5*log(xy2*xy2+2.0*y*y-2.0*x*x)-cc;
  	return f + mod(time,1.5);
}


const vec2 ch_size  = vec2(1.0, 2.0);              // character size (X,Y)
const vec2 ch_space = ch_size + vec2(1.0, 1.0);    // character distance Vector(X,Y)
const vec2 ch_start = vec2 (ch_space.x * -4., 8.); // start position
      vec2 ch_pos   = vec2 (0.0, 0.0);             // character position(X,Y)
      vec3 ch_color = vec3 (0.0, 0.5, 2.5);        // character color (R,G,B)
const vec3 bg_color = vec3 (0.0, 0.0, 0.0);        // background color (R,G,B)

#define REPEAT_SIGN false // True/False; True=Multiple, False=Single

/* 16 segment display...Akin to LED Display.

Segment bit positions:
  __2__ __1__
 |\    |    /|
 | \   |   / |
 3  11 10 9  0
 |   \ | /   |
 |    \|/    |
  _12__ __8__
 |           |
 |    /|\    |
 4   / | \   7
 | 13 14  15 |
 | /   |   \ |
  __5__|__6__

15 12 11 8 7  4 3  0
 |  | |  | |  | |  |
 0000 0000 0000 0000

example: letter A

   12    8 7  4 3210
    |    | |  | ||||
 0001 0001 1001 1111

 binary to hex -> 0x119F
*/

#define n0 ddigit(0x22FF);
#define n1 ddigit(0x0281);
#define n2 ddigit(0x1177);
#define n3 ddigit(0x11E7);
#define n4 ddigit(0x5508);
#define n5 ddigit(0x11EE);
#define n6 ddigit(0x11FE);
#define n7 ddigit(0x2206);
#define n8 ddigit(0x11FF);
#define n9 ddigit(0x11EF);

#define A ddigit(0x119F);
#define B ddigit(0x927E);
#define C ddigit(0x007E);
#define D ddigit(0x44E7);
#define E ddigit(0x107E);
#define F ddigit(0x101E);
#define G ddigit(0x807E);
#define H ddigit(0x1199);
#define I ddigit(0x4466);
#define J ddigit(0x4436);
#define K ddigit(0x9218);
#define L ddigit(0x0078);
#define M ddigit(0x0A99);
#define N ddigit(0x8899);
#define O ddigit(0x00FF);
#define P ddigit(0x111F);
#define Q ddigit(0x80FF);
#define R ddigit(0x911F);
#define S ddigit(0x8866);
#define T ddigit(0x4406);
#define U ddigit(0x00F9);
#define V ddigit(0x2218);
#define W ddigit(0xA099);
#define X ddigit(0xAA00);
#define Y ddigit(0x4A00);
#define Z ddigit(0x2266);
#define _ ch_pos.x += ch_space.x;
#define s_dot     ddigit(0);
#define s_minus   ddigit(0x1100);
#define s_plus    ddigit(0x5500);
#define s_greater ddigit(0x2800);
#define s_less    ddigit(0x8200);
#define s_sqrt    ddigit(0x0C02);
#define nl1 ch_pos = ch_start;  ch_pos.y -= 3.0;
#define nl2 ch_pos = ch_start;  ch_pos.y -= 6.0;
#define nl3 ch_pos = ch_start;	ch_pos.y -= 9.0;

vec2 uv;


float dseg(vec2 p0, vec2 p1)
{
	vec2 dir = normalize(p1 - p0);
	vec2 cp = (uv - ch_pos - p0) * mat2(dir.x, dir.y,-dir.y, dir.x);
	return distance(cp, clamp(cp, vec2(0), vec2(distance(p0, p1), 0)));   
}

bool bit(int n, int b)
{
	return mod(floor(float(n) / exp2(floor(float(b)))), 2.0) != 0.0;
}

float d = 1e6;

void ddigit(int n)
{
	float v = 1e6;	
	
	vec2 cp = uv - ch_pos;

	if (n == 0)     v = min(v, dseg(vec2(-0.405, -1.000), vec2(-0.500, -1.000)));
	if (bit(n,  0)) v = min(v, dseg(vec2( 0.500,  0.063), vec2( 0.500,  0.937)));
	if (bit(n,  1)) v = min(v, dseg(vec2( 0.438,  1.000), vec2( 0.063,  1.000)));
	if (bit(n,  2)) v = min(v, dseg(vec2(-0.063,  1.000), vec2(-0.438,  1.000)));
	if (bit(n,  3)) v = min(v, dseg(vec2(-0.500,  0.937), vec2(-0.500,  0.062)));
	if (bit(n,  4)) v = min(v, dseg(vec2(-0.500, -0.063), vec2(-0.500, -0.938)));
	if (bit(n,  5)) v = min(v, dseg(vec2(-0.438, -1.000), vec2(-0.063, -1.000)));
	if (bit(n,  6)) v = min(v, dseg(vec2( 0.063, -1.000), vec2( 0.438, -1.000)));
	if (bit(n,  7)) v = min(v, dseg(vec2( 0.500, -0.938), vec2( 0.500, -0.063)));
	if (bit(n,  8)) v = min(v, dseg(vec2( 0.063,  0.000), vec2( 0.438, -0.000)));
	if (bit(n,  9)) v = min(v, dseg(vec2( 0.063,  0.063), vec2( 0.438,  0.938)));
	if (bit(n, 10)) v = min(v, dseg(vec2( 0.000,  0.063), vec2( 0.000,  0.937)));
	if (bit(n, 11)) v = min(v, dseg(vec2(-0.063,  0.063), vec2(-0.438,  0.938)));
	if (bit(n, 12)) v = min(v, dseg(vec2(-0.438,  0.000), vec2(-0.063, -0.000)));
	if (bit(n, 13)) v = min(v, dseg(vec2(-0.063, -0.063), vec2(-0.438, -0.938)));
	if (bit(n, 14)) v = min(v, dseg(vec2( 0.000, -0.938), vec2( 0.000, -0.063)));
	if (bit(n, 15)) v = min(v, dseg(vec2( 0.063, -0.063), vec2( 0.438, -0.938)));
	ch_pos.x += ch_space.x;
	d = min(d, v);
}
void main(void)
{

	vec2 aspect = resolution.xy / resolution.y;
	uv = ( gl_FragCoord.xy / resolution.y ) - aspect / 2.0;
	uv *= 30.0;
	
	nl1
	_ _ _  nl2

		 F U C K _ Y O U nl3 
		ch_color = vec3(255,(7.-uv.y+uv.x*0.5)*77.,255)/255.;
	
	vec3 _color = mix(ch_color, bg_color, 1.0- (0.09 / d));
	
	   float x = gl_FragCoord.x;
   float y = gl_FragCoord.y;
   float w = resolution.x*1.0;
   float h = resolution.y*1.0;
   float m=5.0;
   float X1 = -m;
   float X2 = m;
   float Y1 = -m;
   float Y2 = m;
   float _X = (((X2-X1)/w)*x+X1)/1.0;	
   float _Y = ((((Y2-Y1)/h)*y+Y1)*h/w)/1.0;
	
   float s = CELL_SIZE;
   float a = ceil(x/s);
   float b = ceil(y/s);
   float xd = s*(a-0.5);
   float yd = s*(b-0.5);

   //float X=surfacePosition.x;
   //float Y=surfacePosition.y;
   float Xd = (((X2-X1)/w)*xd+X1);
   float Yd = ((((Y2-Y1)/h)*yd+Y1)*h/w);
   float ex = Ex(Xd,Yd);
   float ey = Ey(Xd,Yd);
   float p = ey/ex;
   float ff = (_Y-Yd)-p*(_X-Xd);

	vec3 color = vec3(0.0,0.0,0.0);
	
#ifdef COLOR	
	// color slope
	float f = (fun(X,Y));
	float c = f;
	if (c>=0.0 && c<=0.5) color.r=c*2.0;
	if (c>0.5 && c<=1.0) color=vec3(1.0,c*2.0-1.0,c*2.0-1.0);
	if (c<0.0 && c>=-0.5) color.b=(-c)*2.0;
	if (c<-0.5 && c>=-1.0) color=vec3((-c)*2.0-1.0,(-c)*2.0-1.0,1.0);
#endif
	
#ifdef VECTOR
	// slope field
	if (abs(ff)<=0.006) color=vec3(1.0,1.0,1.0);
#endif

#ifdef CURVES
	//solution curves
	float l1 = 0.0;
	float l2 = 0.0;
	float d=0.01;
	for (float cc=-10.0;cc<=10.0;cc+=0.3)
	{
		l1=curve(_X ,_Y ,cc);
		l2=curve2(_X ,_Y ,cc);
		if (abs(l1)<=d) color=vec3(1.0,0.0,1.0);
		if (abs(l2)<=d) color=vec3(0.0,1.0,1.0);
	}
#endif
	vec2 uv = surfacePosition.xy;
	if(pow(uv.x,2.0)+pow(uv.y+3.7,2.0) < 11.9) color*=vec3(0.1,0.1,0.1);
	if(pow(uv.x,2.0)+pow(uv.y-3.8,2.0) < 11.9) color*=vec3(0.1,0.1,0.1);
	
	_color += color;
	gl_FragColor = vec4(_color,1.0);
	
}