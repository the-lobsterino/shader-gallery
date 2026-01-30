// complex circle
// z^2+w^2=1
// its 4-dimensional, 
// Hard to visualize for nonaliens!
// aliens can!

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


#define PI 3.14159265358979;


float fun(float x, float y, float z)
{
	float p1=mouse.y*10.0;
   	float yt=y*cos(p1)-z*sin(p1);
   	float zt1=y*sin(p1)*z*cos(p1);
	float p2=mouse.x*10.0;
   	float zt=zt1*cos(p2)-x*sin(p2);
   	float xt=zt1*sin(p2)+x*cos(p2);
   
	//float a=0.01;
	//xt=sin(xt);
	//yt=sin(yt);
	//zt=sin(zt);
	//float f= sqrt((xt*xt)+(yt*yt)-a)*sqrt(yt*yt+(zt*zt)-a)*sqrt(zt*zt+(xt*xt)-a)-0.1;
	//float q=xt*xt+yt*yt;
	//float f=((q+pow(zt+0.45,2.0)-0.83)*(q+pow(zt-0.45,2.0)-0.83)*(q+zt*zt)*(q+pow(zt,4.0))*(q+pow(zt-0.45,2.0)-1.0)*(q+pow(zt+0.45,2.0)-1.0)+pow((xt*xt-yt*yt)*xt*yt,2.0));
	float f=cos((xt*xt+zt*zt)*(zt*zt-yt*yt)-zt*zt);
	return f;
}
float dfun(float x, float y, float z, float dz)
{
   return (fun(x,y,z+dz)-fun(x,y,z))/dz;
}
float rootfun(float x, float y)
{
   float zn;
   float z;
   for (float z0n=1.0;z0n<=5.0;z0n+=0.25)
   {
      zn = z0n;
      for (float n=1.0;n<=5.0;n+=1.0)
      {
         zn=zn-fun(x,y,zn)/dfun(x,y,zn,0.0001);
      }
      if (abs(fun(x,y,zn))<=0.001)
      {
         z=zn;
         break;
      }
      else
      {
         z = 9999.0;
         continue;
      }
   }
   return z;
}

void main(void)
{
   float x = gl_FragCoord.x;
   float y = gl_FragCoord.y;
   float w = resolution.x;
   float h = resolution.y;
   float X1 = -4.0;
   float X2 = 4.0;
   float Y1 = -4.0;
   float Y2 = 4.0;

   //float X = (((X2-X1)/w)*x+X1);
   //float Y = ((((Y2-Y1)/h)*y+Y1)*h/w);
	float X=surfacePosition.x;
	float Y=surfacePosition.y;
   float Z = rootfun(X,Y);
   float c = 0.0;
   if (Z==9999.0) c=0.0;
   else
   {
      //float r = sqrt(pow(X-2.0,2.0)+pow(Y-2.0,2.0)+pow(Z,2.0));
      //float f = exp(-r);
      float f = (sin(10.0*Z)+1.0)/2.0;
      c = f;
   }
   gl_FragColor = vec4(vec3(c),1.0);

}