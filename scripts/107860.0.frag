#define PI 3.14159
#define ANGLE 360.
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_mouse;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
    sin(_angle),cos(_angle));
}

void main(){
  vec2 r = u_resolution, p = ( gl_FragCoord.xy * 2.-r)/min( r.x, r.y);
  p = p*rotate2d( radians((( floor( u_time * 45.)*22.5))));
  float b = length(p);
  b = step(0.4,b);
  float a = length(p);
  a = step(a,0.15);
  float d = max(a,b);
  float at = atan(p.y, p.x);
  float c = abs(cos(at * 8.)) + 0.1;
  float num = ((atan(p.y, p.x) / PI) *0.5)+0.5;
  float at2 = (floor((num*ANGLE)/11.25))*11.25/ANGLE;
  d = max(c,d);
  d = step(0.6,d);
  d = max(at2,d);
  gl_FragColor = vec4(vec3(d),1);
}
