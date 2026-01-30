// complex sin(1/z-t) iterated 10 timesx (and other fuckery)

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
varying vec2 surfacePosition;
#define P gl_FragCoord.xy/resolution
//#define t ((mod(time,10.)+130.)*2.)
#define t (((0.+3.*pow(sin(time),14.))+130.)*2.)

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
 mat2 CE = complex(1.0,0.0);
mat2 CI = complex(0.0,1.0);
  float y = IZ(z);
   return cos(x)*cosh(y)*CE+sin(x)*sinh(y)*CI;
}
mat2 csin(mat2 z)
{
mat2 CE = complex(1.0,0.0);
mat2 CI = complex(0.0,1.0);
   float x = RZ(z);
   float y = IZ(z);
   return sin(x)*cosh(y)*CE-cos(x)*sinh(y)*CI;
}
mat2 cexp(mat2 z)
{
mat2 CE = complex(1.0,0.0);
mat2 CI = complex(0.0,1.0);
   float x = RZ(z);
   float y = IZ(z);
   return exp(x)*(cos(y)*CE+sin(y)*CI);
}

mat2 t1(mat2 z)
{
mat2 CE = complex(1.0,0.0);
mat2 CI = complex(0.0,1.0);
   //return cdiv(CE,CE-z)+4.0*(sin(t/16.0)+1.0)*cdiv(CE,CE-z*z);
   //return cdiv(CE,CE-z)+f1R*cdiv(CE,CE-z*z);
   return csin(cdiv(CE,z)-t/100.0*CE);
}

void main(void)
{
   float x = surfacePosition.y*100.+350.;//resolution.y/3.-gl_FragCoord.y;
   float y = surfacePosition.x*100.+500.;//gl_FragCoord.x;
   float w = 1000.;//resolution.x;//y/3.;
   float h = 1000.;//resolution.x;///2.;
   float pi = 3.14159265;
   float X1 = -4.0;
   float X2 = 4.0;
   float Y1 = -4.0;
   float Y2 = 4.0;

   float X = (((X2-X1)/w)*x+X1)/1.0;
   float Y = ((((Y2-Y1)/h)*y+Y1)*h/w)/1.0;

   //mat2 z = mat2(sin(X),-cos(Y-X),Y,X);
   mat2 z = complex(X,Y);
   //mat2 z = complexp(LZ(z1),PZ(z1)-t);
   const int N = 10;
   mat2 fn = z;
   for (int n=0;n<N;n++)
   {
      fn = t1(fn);
   }
   mat2 f = fn;
   float phase = PZ(f);
   float c = phase/pi;
#if 1
   gl_FragColor = vec4(vec3(fract(abs(c))),1.0);
#else
   if (c>=0.0 && c<=0.5)
   {
      gl_FragColor = vec4(2.0*c,0.0,0.0,1.0);
   }
   if (c>0.5 && c<=1.0)
   {
      gl_FragColor = vec4(1.0,c*2.0-1.0,c*2.0-1.0,1.0);
   }
   if (c<0.0 && c>=-0.5)
   {
      gl_FragColor = vec4(0.0,abs(c)*2.0,0.0,1.0);
   }
   if (c<-0.5 && c>-1.0)
   {
      gl_FragColor = vec4(abs(c)*2.0-1.0,1.0,abs(c)*2.0-1.0,1.0);
   }
#endif   
	
	float oG = 1./32.;
	float iG = 1.-oG;
	gl_FragColor *= oG;
	
	#define vect float
	vec2 oP = P;
	vec2 iR = 1./resolution;
	vect vF = iG;
	oP = P + vec2(0., 0.);
	//gl_FragColor += vF*texture2D(backbuffer, oP);
	
	//return;
	vect vFS = 4. * (1. + sqrt(2.));
	vF = vF/vFS;
	vect vFx = 2.*vF/sqrt(2.);
	oP = P + iR*vec2(1., 1.);
	gl_FragColor += vFx*texture2D(backbuffer, oP);
	oP = P + iR*vec2(1., -1.);
	gl_FragColor += vFx*texture2D(backbuffer, oP);
	oP = P + iR*vec2(1., 0.);
	gl_FragColor += vF*texture2D(backbuffer, oP);
	oP = P + iR*vec2(-1., 1.);
	gl_FragColor += vFx*texture2D(backbuffer, oP);
	oP = P + iR*vec2(-1., -1.);
	gl_FragColor += vFx*texture2D(backbuffer, oP);
	oP = P + iR*vec2(-1., 0.);
	gl_FragColor += vF*texture2D(backbuffer, oP);
	oP = P + iR*vec2(0., 1.);
	gl_FragColor += vF*texture2D(backbuffer, oP);
	oP = P + iR*vec2(0., -1.);
	gl_FragColor += vF*texture2D(backbuffer, oP);
	
	// focus on her skull and earrings
	//gl_FragColor *= (1.+smoothstep(cos(surfacePosition.x*1.57/2.),.93,.8))/2.;
	
	
}