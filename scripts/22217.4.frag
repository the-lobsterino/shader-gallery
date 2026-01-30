// mandelbrot in powertower!?

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float t = 1.0*time;


#define MAX_ITER 1

mat2 complex(float zr, float zi)
{
   return mat2(zr,-zi,zi,zr);
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
mat2 CM = complex(-1.0,0.0);

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
mat2 cexp(mat2 z)
{
   float x = RZ(z);
   float y = IZ(z);
   return exp(x)*(cos(y)*CE+sin(y)*CI);
}
mat2 csqrt(mat2 z)
{
   float x = RZ(z);
   float y = IZ(z);
   float p = y/(sqrt(2.0*(sqrt(x*x+y*y)-x)));
   float q = sqrt((sqrt(x*x+y*y)-x)/2.0);
   return complex(p,q);
}
mat2 cln(mat2 z)
{
   float x = RZ(z);
   float y = IZ(z);
   return complex(0.5*log(x*x+y*y),atan(y,x));
}
mat2 cpow(mat2 z, mat2 w)
{
   float x = RZ(z);
   float y = IZ(z);
   float a = RZ(w);
   float b = IZ(w);
   float rs = x*x+y*y;
   float phi = atan(y,x);
   float xt = a*0.5*log(rs)-b*phi;
   float yt = b*0.5*log(rs)+a*phi;
   return cexp(complex(xt,yt));
}

mat2 zho= complex (mouse.x, mouse.y);
mat2 powtow(mat2 z)
{
	mat2 w = z;
	for (int n=1;n<=50;n++)
	{
		w=cpow(z,w)*(z-zho);
	}
	return w;
}

mat2 t1(mat2 z)
{
   //return cdiv(CE,CE-z)+4.0*(sin(t/16.0)+1.0)*cdiv(CE,CE-z*z);
   
   //return csin(cdiv(CE,z)-t/100.0*CE);
   //return csin(csqrt(z)-CE*t);
   //return csqrt(cdiv(CE,CE+z*z*z));
   //return cln(csin(z-CE*t/10.0));
   //return cln(csin(cdiv(CE,z*z*z)-CE*t/100.0));
   //return (cpow(((CE-z*z*z*z*z)/LZ(CE+z*z*z*z*z)),(CI)));
	//return cpow(z,cpow(z,cpow(z,cpow(z,cpow(z,cpow(z,cpow(z,cpow(z,z))))))));
	return cpow(powtow(z),CI);
}


mat2 orig = complex(0.0,0.0);

mat2 meta(mat2 z)
{
mat2 accume = orig;
	for(int n=1;n<=30;n++)
	{
	z = z * cdiv((ccos(zho-cexp(z+zho))*zho-cexp(ccos(z))-z),(-cexp(z+zho)* csin(cexp(z))+csin(z)*cexp(ccos(z))-CE));
	accume = accume + (ccos(cexp(z))-cexp(ccos(z))-z);
	
	}
return accume;
	
	
}


void main(void)
{
   float x = gl_FragCoord.x;
   float y = gl_FragCoord.y;
   float w = resolution.x;
   float h = resolution.y;
   float pi = 3.14159265;
   float X1 = -8.0;
   float X2 = 8.0;
   float Y1 = -8.0;
   float Y2 = 8.0;

   float X = 3.0*(((X2-X1)/w)*x+X1)/1.0;
   float Y = 3.0*((((Y2-Y1)/h)*y+Y1)*h/w)/1.0;

   //mat2 z = mat2(sin(X),-cos(Y-X),Y,X);
   //mat2 z = complex(X,Y);
	vec2 surfacePosition = surfacePosition * 10.0;
   mat2 z = complex(surfacePosition.x,surfacePosition.y);
	
   //mat2 z = complexp(LZ(z1),PZ(z1)-t);
   const int N = MAX_ITER;
   mat2 fn = z;
   for (int n=0;n<N;n++)
   {
      fn = meta(fn);
   }
   mat2 f = fn;
   float phase = PZ(f);
   float c = (phase - pi)/(2.0*pi);
   float R = sin(pi*c);
   R = R* R;
   float G = sin(pi*(c+1.0/3.0));
   G = G * G;
   float B = sin(pi*(c+2.0/3.0));
   B = B * B;

   gl_FragColor = vec4(R,G,B,1.0);
}