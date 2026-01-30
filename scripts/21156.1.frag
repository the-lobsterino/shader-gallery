// topological string theory
// simple

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


const float pi = 3.14159265;

#define SHOW_FIELD
bool SHOW_INTERFERENCE = false;

#define INTER_FREQUENCY 50.0

#ifdef SHOW_FIELD
void main(void)
{
   //float x = gl_FragCoord.x;
   //float y = gl_FragCoord.y;
	const float scale = 16.0;
   float x = surfacePosition.x*scale;
   float y = surfacePosition.y*scale;
   float w = resolution.x;
   float h = resolution.y;
   float X1 = -10.0;
   float X2 = 10.0;
   float Y1 = -10.0;
   float Y2 = 10.0;
   float t = 1.0*time;

   float X = (((X2-X1)/w)*x+X1);
   float Y = ((((Y2-Y1)/h)*y+Y1)*h/w);
   //float X = surfacePosition.x;
   //float Y = surfacePosition.y;
   float V = 1.0;
   
   float fr2 = INTER_FREQUENCY;
   float r = 10.0*pi;
   float z = 0.0;
   float q = 0.0;
   float p = 0.0;
   const float N = 10.0;
   for (float phi=0.0;phi<2.0*pi;phi += 2.0*pi/N)
   {
      q = r*cos(phi);
      p = r*sin(phi);
      z = z + sin((fr2) * sqrt(pow(abs(X-5.0*pi-q),2.0)+pow(abs(Y-p),2.0))-t);
      
   }

   for (float phi=pi;phi<3.0*pi;phi += 2.0*pi/N)
   {
      q = r*cos(phi);
      p = r*sin(phi);
      z = z + sin((fr2) * sqrt(pow(abs(X+5.0*pi-q),2.0)+pow(abs(Y-p),2.0))+t);
      
   }


   float Z = ((z)/(N*2.0))*1.0;
   if (Z<0.0) Z=10e10;

   
   
   float freq = 160.0;
   //float phi2 = t/8.0;
   float phi2 = pi/40.0;
   float Xt = cos(phi2)*X-sin(phi2)*Z;
   float Zt = sin(phi2)*X+cos(phi2)*Z;
   float f = (sin(freq*Xt)+sin(freq*Y)+sin(freq*Zt))/3.0;
   
   //float f = sin(freq*Xt+t*4.0);
   //float f = sin(freq*sqrt((Xt)*(Xt)+(Y)*(Y)+(Zt)*(Zt)));
   float c = f;
   if (V<0.0)
   {
      c = 0.0;
      gl_FragColor = vec4(c,0.0,0.0,1.0);
   }
   else
   {
      if (c>0.0)
      {
         gl_FragColor = vec4(c,0.0,0.0,1.0);
      }
      if (c<=0.0)
      {
         gl_FragColor = vec4(0.0,abs(c),0.0,1.0);
      }
   }
}

#else
void main(void)
{
   //float x = gl_FragCoord.x;
   //float y = gl_FragCoord.y;
	const scale = 5.0;
   float x = surfacePosition.x*scale;
   float y = surfacePosition.y*scale;
   float w = resolution.x;
   float h = resolution.y;
   float X1 = -10.0;
   float X2 = 10.0;
   float Y1 = -10.0;
   float Y2 = 10.0;
   float t = 1.0*time;

   float X = ((X2-X1)/w)*x+X1;
   float Y = (((Y2-Y1)/h)*y+Y1)*h/w;
   float f = INTER_FREQUENCY;
   float r = 10.0*pi;
   float z = 0.0;
   float q = 0.0;
   float p = 0.0;
   const float N = 10.0;
   for (float phi=0.0;phi<2.0*pi;phi += 2.0*pi/N)
   {
      q = r*cos(phi);
      p = r*sin(phi);
      z = z + sin((f) * sqrt(pow((X-5.0*pi-q),2.0)+pow(Y-p,2.0))-t);
      
   }

   for (float phi=pi;phi<3.0*pi;phi += 2.0*pi/N)
   {
      q = r*cos(phi);
      p = r*sin(phi);
      z = z + sin((f) * sqrt(pow((X+5.0*pi-q),2.0)+pow(Y-p,2.0))+t);
      
   }

   if (SHOW_INTERFERENCE) z = ((z)/(N*2.0));
   else (z>0.0) ? z = ((z)/(N*2.0)): z=0.0;

   if (z>=0.0)
   {
      gl_FragColor = vec4(z,0.0,0.0,1.0);
   }
   else
   {
      gl_FragColor = vec4(0.0,-z,0.0,1.0);
   }
}
#endif