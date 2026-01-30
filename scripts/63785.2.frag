precision highp float;

uniform vec2 resolution;
uniform float time;

void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 p = (gl_FragCoord.xy - resolution.xy/2.) / resolution.y;
	p*=1.4;
  float angle = atan(p.y, p.x);
  float radius = length(p*p) * (1. + sin(p.x*6.0+angle*2. + time)*.1);
  float thin = 0.03 + 0.01*sin(p.y*10.0+time*1. + angle);
  vec3 color = vec3(0.5+0.4*cos(angle*vec3(3.7,1.8,2.9))) * thin / abs (radius - 0.3+sin(20.0*p.x*p.y)*0.1);
  gl_FragColor = vec4(color,1.);
}
