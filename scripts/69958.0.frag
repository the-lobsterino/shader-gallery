#ifdef GL_ES
  precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

vec3 hsv2rgb (vec3 hsv)  // from HSV to RGB color vector
{ 
  hsv.yz = clamp (hsv.yz, 0.0, 1.0);
  return hsv.z * (1.0 + 0.63 * hsv.y * (cos (2.0 * 3.14159 *
	(hsv.x + vec3 (0.0, 2.0 / 3.0, 1.0 / 3.0))) - 1.0));
}

const float dotsnbt = 122.0; // Number of dots for the tree
float intensity = 1000.0; // Light intensity for the tree

void main()
{
  float mx = max(resolution.x, resolution.y);
  vec2 scrs = resolution / mx;
  vec2 uv = vec2(gl_FragCoord.x, resolution.y-gl_FragCoord.y)/mx;
  vec2 pos = vec2(0.0); // Position of the dots
  vec3 col = vec3(0.0); // Color of the dots
  
  /*** Tree ***/
  float angle = dotsnbt*2.8; // Angle of the cone
  for(float i = 0.0; i < dotsnbt; i++)
  {
    pos = vec2(scrs.x/2.0+sin(i/2.0-time*1.2)/(3.0/i*angle)
	      ,scrs.y*(i/dotsnbt + 0.21)*0.80);
    float cint = (1.8-mouse.x) / (distance(uv,pos) * intensity);
    col += hsv2rgb(vec3(1.5*i/dotsnbt+fract(time/4.0)
                  ,distance(uv,pos)*(22.0*intensity)
                  ,cint*cint));
  }
  gl_FragColor = vec4( col, 1.0 );
}
