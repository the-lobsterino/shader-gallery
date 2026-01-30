#ifdef GL_ES
precision mediump float;
#endif

varying vec2 surfacePosition;
uniform float time;


const float color_intensity = 0.005;
const float Pi = 3.14159;
vec2 surfacePosition2 = surfacePosition * 7.5 + sin(time) + 5.* cos(time/2.5);

void main()
{
  vec2 p=(3.32*surfacePosition2);
  for(int i=1;i<5;i++)
  {
    vec2 newp=p;
    newp.x+=0.12/float(i)*sin(float(i)*Pi*p.y+time*0.45)+0.1;
    newp.y+=0.13/float(i)*cos(float(i)*Pi*p.x+time*-0.4)-0.1;
    p=newp;
  }
  vec3 col=vec3(sin(p.x+p.y)*.55+.5,sin(p.x+p.y+6.)*.5+.5,sin(p.x+p.y+12.)*.5+.5);
  gl_FragColor=vec4(col, 1.0);
}
