// alien blob effect

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
   float fr = 32.0;
   //float R = 5.0*(sin(t/2.0)+1.0)/2.0;
   float R = 3.0;
   //float gg = (sin(t*7.0+sin(t*8.0))+1.0)*0.5*0.25+0.875;
   //float q = R*R-X*X/(gg*gg)-gg*gg*Y*Y+2.0*sin(4.0*X-t*8.0);
   float q = 2.0-pow(sqrt(X*X+Y*Y+1.0*(sin(4.0*X-t*4.0)+sin(4.0*Y)))-R,2.0);
   float Z = sqrt(q);
   //float Z = 0.0;
   //float phi = t/32.0;
   float phi = pi/8.0;
   float Xt = cos(phi)*X-sin(phi)*Z;
   float Zt = sin(phi)*X+cos(phi)*Z;

   //float f = (sin(fr*(Xt))+sin(fr*Y)+sin(fr*(Zt)))/3.0;
   float f = sin(fr*Xt-t*1.0);
   float c = f;
   if (q<0.0)
   {
      c = 0.0;
      gl_FragColor = vec4(c,0.0,0.0,1.0);
   }
   else
   {
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