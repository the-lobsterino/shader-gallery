precision mediump float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time; 

//original by Robert Schütze (trirop) 07.12.2015
void main()
{
     vec2 uv = (gl_FragCoord.xy-resolution*.5)/(resolution.y);
     uv*=0.75;
     vec3 p = vec3(uv,cos(time*3.));
  
     for (int i = 0; i < 10; i++)
     {
              p.zxy = (abs (  ( abs(p) / dot(p,p ) - vec3(1.0, 1.0, (mod(time*.2,16.)-3.)/10.0))));
     }
     
     gl_FragColor.rgb = p;
     gl_FragColor.a = 1.0;
} 