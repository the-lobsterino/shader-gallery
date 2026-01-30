#ifdef GL_ES
  precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

vec3 hsv2rgb (vec3 hsv)  // din HSV in RGB
{ 
  hsv.yz = clamp (hsv.yz, 0.0, 1.5);//de la 1.0 la 1.5 apare rosu ; hsv,yz(fara alb)
  return hsv.z * (1.0 + 0.63 * hsv.y * (sin (2.0 * 3.14159 *
	(hsv.x + vec3 (0.0, 2.0 / 3.0, 1.0 / 3.0))) - 1.0));
}

const float dotsnbt = 122.0; // Numarul de puncte al bradului
float intensity = 700.0; // Intensitatea luminii bradului

void main()
{
  float mx = max(resolution.x, resolution.y);
  vec2 scrs = resolution/ mx;
  vec2 uv = vec2(gl_FragCoord.x, resolution.y-gl_FragCoord.y)/mx;
  vec2 pos = vec2(0.0); // Pozitia punctelor
  vec3 col = vec3(0.4); // Culoarea fundalului
  
  /*** Bradul ***/
  float angle = dotsnbt*3.0; // Unghiul conului
  for(float i = 0.0; i < dotsnbt; i++)
  {
    pos = vec2(scrs.x/2.0+sin(i/2.0+time*1.2)/(3.0/i*angle)
	      ,scrs.y*(i/dotsnbt + 0.21)*0.80);
    float cint = (1.8-mouse.y) / (distance(uv,pos) * intensity);// mouse.y pt cresterea intensitatii culorii cu miscarea pe y
    col += hsv2rgb(vec3(0.5*i/dotsnbt+fract(mouse.x/1.0)// 0.5*i/fostsnbt pt culoarea uniforma-schimbarea culorilor din mouse pe orizontala
                  ,distance(uv,pos)*(22.0*intensity)
                  ,cint*cint));
  }
  gl_FragColor = vec4( col, 1.0);
}
