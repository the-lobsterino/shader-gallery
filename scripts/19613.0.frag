#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void)
{
   float x = gl_FragCoord.x;
   float y = gl_FragCoord.y;
   float w = resolution.x;
   float h = resolution.y;
   float pi = 3.14159265;
   float X1 = -10.0;
   float X2 = 10.0;
   float Y1 = -10.0;
   float Y2 = 10.0;
   float t = 1.0*time;

   float X = ((X2-X1)/w)*x+X1;
   float Y = (((Y2-Y1)/h)*y+Y1)*h/w;
   float fr = 100.0;
   float R = 4.0;
   float q = R*R-X*X-Y*Y;
   //float q = 1.0;
   //float phi = pi/2.0;
   
   // image distance from sphere
   float d = 2.0*R;
   //float d = (sin(t/10.0)+1.0)*R;
   
   // refraction coefficient
   //float n = (sin(t/10.0)+1.0)*10.0;
   float n = (sin(t/10.0)+1.0)*3.0;
   //float n = 1.33; // water
   //float n = 1.5; // glass
   //float n = 2.4; // diamond
   
   //X = cos(phi)*X-sin(phi)*Y;
   //Y = sin(phi)*X+cos(phi)*Y;
   
   float f = 0.0;
   float c = 0.0;
   if (q<0.0)
   {
      f = (sin(fr*X)+sin(fr*Y));
      f = f/2.0;
      c = f;
      if (c>=0.0)
      {
         gl_FragColor = vec4(c,0.0,0.0,1.0);
      }
      else
      {
         gl_FragColor = vec4(0.0,-c,0.0,1.0);
      }
   }
   else
   {
      float r = sqrt(X*X+Y*Y);
      X = X-(d+R+sqrt(R*R-r*r))*X*(sqrt(R*R*n*n-r*r)-sqrt(R*R-r*r))/(r*r+sqrt(R*R*n*n-r*r)*sqrt(R*R*n*n-r*r));
      Y = Y-(d+R+sqrt(R*R-r*r))*Y*(sqrt(R*R*n*n-r*r)-sqrt(R*R-r*r))/(r*r+sqrt(R*R*n*n-r*r)*sqrt(R*R*n*n-r*r));
      f = (sin(fr*X)+sin(fr*Y));
      f = f/2.0;
      c = f;
      if (c>=0.0)
      {
         gl_FragColor = vec4(c,0.0,0.0,1.0);
      }
      else
      {
         gl_FragColor = vec4(0.0,-c,0.0,1.0);
      }
   }
}
