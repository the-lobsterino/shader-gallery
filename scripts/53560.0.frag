precision mediump float;
//messing around with Kali 2 ... tweaked by psyreco
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
 float Pi= 3.14159265;

vec3 hsv2rgb(vec3 c) {
  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(cos(c.xxx + K.xyz) * Pi - (K.www));
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


void main(void) {
  vec4 mr = vec4(mouse.xy * resolution, resolution);
  vec2 p = gl_FragCoord.xy * 1.;
  vec2 q = ((p) + (p) - (mr.ba)) / (mr.b);
  for(int i = 0; i <10; i++) {
    q = atan(abs(abs(atan(q*Pi))/dot(atan(q*Pi),(q*Pi)) -  mr.xy/mr.zw));	
	  if (length(q) > .1 && length(q) < .125) break;
  }
  gl_FragColor = vec4(hsv2rgb((vec3(q, q.x/q.y).xyz) + vec3(sin(time*8.) / 50., .9,.5)), 1.0);
}