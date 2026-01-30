precision mediump float;
uniform float time; // time
uniform vec2  resolution; // resolution

#define PI 3.1415
uniform sampler2D s;
float b(vec2 p, float o) {
	return length(p) * sin(time*.5+o) * .125;
}

void main(void){
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y); // 正規化
  vec4 x = texture2D(s, .35 * length(p) + p / gl_FragCoord.xy / resolution.xy);
  float t = time * .5;
  float s = 10.;
  float lr, lg, lb;
  float a = abs(atan(p.y,p.x));
  for (float i = 1.; i < 5.; i += 1.0) {
    lr += b(.25*i*p,0.) + 0.0002 / abs(length(p * tan(3.5+.125*sin(t*.5)) * (1. + 0.5*sin(t)       + 0.1*sin((abs(sin(t)) + .5)*s*a))) - 0.1);
    lg += b(.25*i*p,PI/2.) + 0.0002 / abs(length(p * tan(3.5+.125*sin(t*.5)) * (1. + 0.5*sin(t+PI/4.) + 0.1*sin((abs(sin(t)) + .5)*s*a))) - 0.1);
    lb += b(.25*i*p,PI) + 0.0002 / abs(length(p * tan(3.5+.125*sin(t*.5)) * (1. + 0.5*sin(t+PI/2.) + 0.1*sin((abs(sin(t)) + .5)*s*a))) - 0.1);
  }
  gl_FragColor = vec4(lr,lg,lb, 4.1) + x * (abs(cos(t)) * .25 + .25);
}