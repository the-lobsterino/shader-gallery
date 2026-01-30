// clearly it rotates. but in the center it seems counterrotate

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;

void main(void)
{
   float x = gl_FragCoord.x;
   float y = gl_FragCoord.y;
   float w = resolution.x;
   float h = resolution.y;
   float pi = 3.14159265;
   float X1 = -30.0*pi;
   float X2 = 30.0*pi;
   float Y1 = -30.0*pi;
   float Y2 = 30.0*pi;
   float t = 10.0*time;

   float X = ((X2-X1)/w)*x+X1;
   float Y = (((Y2-Y1)/h)*y+Y1)*h/w;
   float f = 2.0;
   float r = 10.0*pi;
   float phi = 0.0;
   float z = 0.0;
   float q = 0.0;
   float p = 0.0;
   const float N = 10.0;
   for (float i=1.0;i<N;i+=1.0)
   {
      q = r*cos(phi);
      p = r*sin(phi);
      z = z + sin((f+phi) * sqrt(pow((X-q),2.0)+pow(Y-p,2.0))-t);
      phi = 2.0*pi*i/N;
   }

   z = (z)/N;
   if (z>=0.0)
   {
      gl_FragColor = vec4(z,0.0,0.0,1.0);
   }
   else
   {
      gl_FragColor = vec4(0.0,-z,0.0,1.0);
   }
}
