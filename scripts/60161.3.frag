#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


bool inCircle(vec2 center, float size, vec2 pos) {
  float dist = distance(pos, center);
  return dist <= size;
}

bool ipsoid(vec2 center, float size, float offset, float angle, vec2 pos) {
  vec2 offsetShift = vec2(cos(angle),sin(angle));
  vec2 center1 = center - offset * size * offsetShift;
  vec2 center2 = center + offset * size * offsetShift;
  return inCircle(center1, size, pos) && inCircle(center2, size, pos);
}

vec4 infty(float i, float maxI) {
  float r = 0.5+0.2*sin((i*7.0)/maxI+time);
  float g = 0.3+0.2*sin(2.0+(i*7.0)/maxI+time);
  float b = 0.5+0.3*sin(2.0+(i*7.0)/maxI+time);
  vec4 infty = vec4(r,g,b,1);
  return infty;
}

vec4 infty(int i, int maxI) {
  return infty(float(i), float(maxI));
}

void main(void)
{
	
  vec2 pos = 2.*(gl_FragCoord.xy -.5*resolution.xy)/resolution.y;
pos *= vec2(resolution.y / resolution.x, 1);
  pos.x = abs(pos.x); 
// pos.y = abs(pos.y);

  

  vec4 background = vec4(0.05,0.05,0.005,1);
  vec4 foreground = vec4(0,0,0,1);
  
  const int maxI = 15;
  int inside = 0;
  int outSide = 0;
  for (int i = 0; i < maxI; i++) {
    float i_ratio = float(i)*1.5 / float(maxI);
    bool lipsi = ipsoid(vec2(0.2*sin((0.2*time+i_ratio)*3.1415)+0.1*sin(2.0+1.5*i_ratio*mouse.x), 0.2*cos(0.1*time+123.0)*cos((0.3*time+i_ratio*mouse.y)*3.1415)),
                        5.0 - (i_ratio) * 5.1,
                        0.85,
                        3.1415/2.0 + sin(5.0+mouse.x*0.5*(0.09+sin(time*.1))*5.*i_ratio*time+time) + sin(i_ratio*mouse.x) + 0.25*time*mouse.y/100.0,
                        pos);
    foreground += float(int(lipsi)) * 4.0 / float(maxI) * infty(i, maxI);
    
    if (!lipsi) {
      break;
    }
  }
  float inside_ratio = float(inside)*1.0 / float(maxI);
  
  gl_FragColor = foreground + background;
}
