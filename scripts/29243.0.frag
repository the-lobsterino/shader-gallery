#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float line(vec2 p1, vec2 p2, vec2 p, float width, float spread)
{
    width = 1.0 / width;
    vec2 p2p1 = p1 - p2;
    vec2 p1p2 = -(p2p1);
    vec2 p2p = p - p2;
    vec2 p1p = p - p1;
    vec2 pp1 = -(p1p);
    vec2 pd = normalize(vec2(p2p1.y, -p2p1.x));
    float proj = dot(pd, pp1);
    float pr1 = dot(p2p1, p2p);
    float pr2 = dot(p1p2, p1p);

    if(pr1 > 0.0 && pr2 > 0.0) {
        return pow(1.0 / abs(proj * width), spread);    
    } else {    
        return 0.0;
    }
}

void main(void) {

  vec2 uv = (gl_FragCoord.xy / resolution.xy);
  vec2 center = vec2(0.5, 0.5);
  vec2 v1 = vec2(0.1, 0.1);
  vec2 v2 = vec2(0.08, 0.08);
  vec2 v3 = vec2(0.09, 0.09);
  
  float vertColor = 0.0;

  // Middle circle
  vertColor = 0.3 - smoothstep(0.0, 0.2, sqrt(pow(uv.x - center.x, 2.0) + pow(uv.y - center.y, 2.0)));
  vertColor += 0.2 - smoothstep(0.0, 0.15, sqrt(pow(uv.x - center.x, 4.0) + pow(uv.y - center.y - 0.1, 4.0)));
 // vertColor -= mod(cos(uv - center), 0.5);
  //vertColor += mod(acos(uv-center), 0.1);
  //vertColor += 0.1;
  vertColor += cos(uv.y) + sin(uv.y);
  //vertColor += 0.2*cos(uv.x + uv.y);
  for(float i = 0.0; i < 8.0; i+=0.5) {
    //vertColor -= smoothstep(i * 0.1, (i + 1.0) * 0.1, uv.x) + smoothstep((i + 1.0) * 0.1, i * 0.1, uv.x);
    //vertColor += (0.02 * i * (smoothstep(v2, v1, mod(uv, 0.1)) 
    //  + smoothstep(v1, v3, mod(uv, 0.1))))
        //* (cos(time) + 2.5) * 0.3;
  vertColor += 0.05 * (uv.x - center.x) * (-sin(time)); //What kind of computer are you running to compile vec2 in float with this?
    vec2 p = vec2(cos(i),sin(i)) * 2.0;
    vertColor += line(center, p, uv, 0.005, 5.0) * (1.5 + sin(time));
  //vertColor += 0.1 * mod((sqrt(uv)), 0.1);
    
  }
  
  // No rays on the half top
  if(uv.y > center.y) {
    vertColor = 0.0;
  }
  
  gl_FragColor = vec4(vertColor, vertColor, vertColor, 1.0);
}

/// http://glslsandbox.com/e