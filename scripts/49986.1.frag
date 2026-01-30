// 


#ifdef GL_ES
precision mediump float;
#endif

//view at .5 - sphinx

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//varying vec2 surfacePosition;

//float t = time/10.0;
float pi=atan(1.0)*4.0;
float t = (mouse.x-0.5)*2.0*pi;

#define COLOR
#define VECTOR
//#define CURVES

#if 1
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
	w = z-CE+cdiv(CE,z+CE);
	return w;
}
#endif

#define CELL_SIZE 12.0

float Ex(float x, float y)
{
	float ex = 1.0;
	//ex = x*(x*x+y*y-1.0);
	mat2 z = complex(x,y);
	ex  = RZ(cfun(z));
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
	//ey = y*(x*x+y*y+1.0);
	mat2 z = complex(x,y);
	ey  = IZ(cfun(z));
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
	//float a = 2.0*(mouse.x-0.5);
	//float a = sin(time/4.0);
	//f = asin(y)-x-cc;
	//f = atan(x*x-y*y-1.0,2.0*x*y)-cc;
	f = y/(x*x+y*y)+atan(y,x)-cc*0.5;
	return f;
}
float curve2(float x, float y, float cc)
{
   	float f = 1.0;
	//float a = 2.0*(mouse.x-0.5);
	//float a = sin(time/4.0);
	//float xy2 = x*x+y*y;
	//f = 0.5*log(xy2*xy2+2.0*y*y-2.0*x*x+1.0)-cc;
	f = log(x*x+y*y)*0.5-x/(x*x+y*y)-cc*0.5;
  	return f;
}

void main(void)
{
   float x = gl_FragCoord.x * .25 + resolution.x * .365;
   float y = gl_FragCoord.y * .25 + resolution.x * .205;
   float w = resolution.x*1.0;
   float h = resolution.y*1.0;
   float m=5.0;
   float X1 = -m;
   float X2 = m;
   float Y1 = -m;
   float Y2 = m;
   float X = (((X2-X1)/w)*x+X1)/1.0;
   float Y = ((((Y2-Y1)/h)*y+Y1)*h/w)/1.0;
	
   float s = CELL_SIZE*.1;
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
   float ff = (Y-Yd)-p*(X-Xd);

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
		l1=curve(X,Y,cc);
		l2=curve2(X,Y,cc);
		if (abs(l1)<=d) color=vec3(1.0,0.0,1.0);
		if (abs(l2)<=d) color=vec3(0.0,1.0,1.0);
	}
#endif
	
	gl_FragColor = vec4(color,1.0);
}