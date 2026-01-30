// red-green conveyour of phaseous quantum boats


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

   float X = (((X2-X1)/w)*x+X1)/1.0;
   float Y = ((((Y2-Y1)/h)*y+Y1)*h/w)/1.0;

   mat2 z = mat2(sin(10.0*X)*0.5*sin(10.0*t-Y),-(Y),sin(1.0*Y-t+sin(t)),(X));
   mat2 f = z*z*z*z*z*z*z;
   float fx = f[0][0]+1.0;
   float fy = f[0][1];
   float phase = atan(fy,fx);
   float c = phase/pi;
#if 0
   gl_FragColor = vec4(abs(c),0.0,0.0,1.0);
#else
   if (c>=0.0)
   {
      gl_FragColor = vec4(c,0.0,0.0,1.0);
   }
   if (c<0.0)
   {
      gl_FragColor = vec4(0.0,abs(c),0.0,1.0);
   }
#endif   
}