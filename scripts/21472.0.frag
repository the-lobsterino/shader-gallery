#ifdef GL_ES
precision mediump float;
#endif

#define SPEEDX -50.
#define SPEEDY 30.

#define COLOR_W vec4(1.0,1.0,1.0,1.0)
#define COLOR_B vec4(0.0,0.4,0.4,1.0)

#define SIZEX 50
#define SIZEY 50
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
 

   vec2 pos = mod(gl_FragCoord.xy, vec2(1920.0,1080.0)) - vec2(mouse.x*resolution.x,mouse.y*resolution.y);
      float dist_squared = dot(pos, pos);
  
     
  
  
      
 
 vec4 color;
 
 int x = int(gl_FragCoord.x + time * SPEEDX) / SIZEX;
 int y = int(gl_FragCoord.y + time * SPEEDY) / SIZEY;
 
 float sum = float(x+y);
 
 if (mod(sum, 2.) == 0.)
  color = COLOR_W;
 else
  color = COLOR_B;
 
 
 //test mit sich ausdehenden kreisen
 
 //gl_FragColor = mix(color, vec4(.0, .0, .0, 1.0),
                      //  smoothstep(floor(0.0),floor((mod((time*time)/(20000.00/time),150000.00))),dist_squared));
 
 gl_FragColor = mix(color, vec4(.0, .0, .0, 1.0),
                        smoothstep(floor(0.0),floor(20000.00),dist_squared));
 
}