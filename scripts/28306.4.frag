// LogIntegral(z) current lines. wrong?!
// 


#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//varying vec2 surfacePosition;

float t = 1.0*time;
float pi=atan(1.0)*4.0;

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

mat2 CE = complex(1.0,0.0);
mat2 CI = complex(0.0,1.0);

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
#endif

#define CELL_SIZE 12.0

mat2 cli(mat2 z)
{
	mat2 w=cln(cln(z));
	float nfac = 1.0;
	for (float n=1.0;n<=10.0;n+=1.0)
	{
		nfac*=n;
		w+=cpow(cln(z),CE*n)/(nfac*n);
	}
	return w;
}
mat2 cfun(mat2 z)
{
	mat2 w = (z);
	w = cln(z);
	//w = cpow(w,CI);
	return w;
}


float Ex(float x, float y)
{
   float a = sin(time*0.25);
   float b = cos(time*0.25)+1.0;
   //return x*a-y*b;
	//return (-(x+1.0))/sqrt((x+1.0)*(x+1.0)+y*y)+(-y)/sqrt((x-1.0)*(x-1.0)+y*y);
	mat2 z = complex(x,y);
	mat2 w = cfun(z);
	float ex = RZ(w);
	return ex;
}
float Ey(float x, float y)
{
   float a = sin(time*0.25);
   float b = cos(time*0.25)+1.0;
   //return x*b+y*a;
	//return (-y)/sqrt((x+1.0)*(x+1.0)+y*y)+(x-1.0)/sqrt((x-1.0)*(x-1.0)+y*y);
	mat2 z = complex(x,y);
	mat2 w = cfun(z);
	float ey = IZ(w);
	return ey;
}


float fun(float x, float y)
{
	float f = 0.0;
	f=atan(Ey(x,y),Ex(x,y))/pi;
   	return f;
}
float curve(float x, float y)
{
	float f = 1.0;
	float c = 20.0*(mouse.x-0.5);
	//f = RZ(cli(CE*x-CI*y)-cli(CE*x+CI*y))-c;
	f = IZ(cli(CE*x-CI*y)-cli(CE*x+CI*y))-c;
	return f;
}
float curve2(float x, float y)
{
   float f = 1.0;
   return f;
}

void main(void)
{
   float x = gl_FragCoord.x;
   float y = gl_FragCoord.y;
   float w = resolution.x*1.0;
   float h = resolution.y*1.0;
   float m=30.0;
   float X1 = -m;
   float X2 = m;
   float Y1 = -m;
   float Y2 = m;
   float X = (((X2-X1)/w)*x+X1)/1.0;
   float Y = ((((Y2-Y1)/h)*y+Y1)*h/w)/1.0;
	
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
   float ff = (Y-Yd)-p*(X-Xd);
	
   float f = (fun(X,Y));
   float l=curve(X,Y);
   //float l2=curve2(X,Y);
   float d=0.04;
   float c = f;
   vec3 color = vec3(0.0,0.0,0.0);
   if (c>=0.0 && c<=0.5) color.r=c*2.0;
   if (c>0.5 && c<=1.0) color=vec3(1.0,c*2.0-1.0,c*2.0-1.0);
   if (c<0.0 && c>=-0.5) color.b=(-c)*2.0;
   if (c<-0.5 && c>=-1.0) color=vec3((-c)*2.0-1.0,(-c)*2.0-1.0,1.0);
   if (abs(l)<=d) color=vec3(0.0,1.0,0.0);
   if (abs(ff)<=0.02) color=vec3(1.0,1.0,1.0);
   //if (abs(l2)<=d) color=vec3(0.0,1.0,0.0);
   gl_FragColor = vec4(color,1.0);
}