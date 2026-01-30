#ifdef GL_ES
precision mediump float;
#endif
#define COLOR_W vec4(1.0,1.0,1.0,1.0)
#define COLOR_B vec4(0.0,0.4,0.4,1.0)
#define COLOR_G vec4(0.0,0.3,0.0,1.0)
#define COLOR_R vec4(1.0,0.0,0.0,1.0)
#define SIZEX 5
#define SIZEY 5
void main( void ) 
{
   vec2 pos = mod(gl_FragCoord.xy, vec2(8.0,8.0));
      float dist_squared = dot(pos, pos);
 vec4 color;
 int x = int(gl_FragCoord.x  ) / SIZEX;
 int y = int(gl_FragCoord.y ) / SIZEY;
 float vx = mod(float(x), 20.);
 float vy = mod(float(y), 20.);
 if ((vx == 0.) || (vy == 0.))
	 color = COLOR_W;
 else{
  if ((vx < 3.) || (vx > 17.) || (vy < 3.) || (vy > 17.) || (vx == 5.) || (vx == 15.) || (vy == 5.) || (vy == 15.))
  color = COLOR_G;
 else 
  color = COLOR_R;}
 gl_FragColor = mix(color, vec4(.0, .0, .0, 1.0),
                        smoothstep(floor(0.0),floor(20000.00),dist_squared));
}