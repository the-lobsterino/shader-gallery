#ifdef GL_ES
precision mediump float;
#endif

varying vec2 surfacePosition;
uniform float time;


const float color_intensity = 0.4;
const float Pi = 3.14159;

void main()
{
  vec2 p=(2.*surfacePosition);
  for(int i=1;i<9 ;i++)
  {
    	vec2 newp=p;
	float ii = float(i);  
    	newp.x+=0.55/ii*sin(ii*Pi*p.y+time*.01+cos((time/(10.*ii))*ii));
    	newp.y+=0.55/ii*cos(ii*Pi*p.x+time*.01+sin((time/(10.*ii))*ii));
    	
  }
  gl_FragColor = vec4(cos(p.x+p.y+2.+time)+.4, sin(p.x+p.y+3.+time)*.5+.2, (sin(p.x+p.y+4.+time)+cos(p.x+p.y+12.+time))*.02+.05, .4);
}
