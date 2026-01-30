#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

const float Pi = 3.14159;
void main()
{
  float col;
  vec2 n = gl_FragCoord.xy/resolution;
  float y = float((((sin(1.0*Pi*n.x+(time/1000.0))+1.0)/2.0)*resolution.y));
  if (gl_FragCoord.y+1.0 >= y && gl_FragCoord.y-1.0 <= y)
    col=1.0;
  else
    col=0.0;
  gl_FragColor=vec4(col,col,col,1.0);
	
}