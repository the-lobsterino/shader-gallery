// big fucks
precision highp float;
uniform float time;
uniform vec2  resolution;

float wv(float x, float t){
  x = -x;
  return (cos(x * 21.0 + t) + sin(x * 13.1 + t * 1.0) + cos(x * 17.0 + t * 1.0) + sin(x * 77.0 + t * 16.0))/8.0;
}

void main(){
  vec2 p = (gl_FragCoord.xy - 0.5*resolution) / min(resolution.x, resolution.y);
	p.y += sin(12.0*p.x+time*0.3)*0.1;
	p.x *= dot(p,p);
  float a = wv(p.x/1.05, time*0.7);
	a = smoothstep(-0.5,2.0,a);
  float f = 0.15 / mod(p.x+p.y + a*1.15, 0.4);
  gl_FragColor = vec4(mix(vec3(0.2, 0.1, 0.3), vec3(0.8, 0.47, 0.7), f), 1.0);
}
