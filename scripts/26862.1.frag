#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = 3.1415926;

float garb(vec2 v, float m) {
  return (mod(v.x*m + (1.-v.y)*m, (1.-v.x*m)+v.y*m));
}

float tarb(vec2 v, float m) {
  return (dot(v.x*m - (1.-v.y)/m, (1.+v.x/m)+v.y*m));
}

void main() {
  vec2 pos = ( gl_FragCoord.xy / resolution.xy );
  float tt = mix(time,cos(time),sqrt(time))*0.1;	
  float a = garb(vec2(pos.y, cos(tan(pos.x+pos.x+1000001.))), cos(tt)+1.5);
	a += tarb(vec2(pos.x, cos(tan(pos.y+pos.y+1000001.))), cos(-tt)+1.5);
  float c = garb(vec2(pos.y, mod((pos.x,pos.x),(time,tt))), cos(a-tt)+1.5);
	c /= tarb(vec2(pos.x, mod((pos.y,pos.y),(time,tt))), cos(a-tt)+1.5);
  gl_FragColor = vec4(.5*a+.15+.5*c,
                      .0*a+.2+.9*c,
                      .01*a+.3+.6*c,
                      1.);
	  gl_FragColor -= vec4(.2*c+.05*a,
                      .01*c+.2*a,
                      .1*c+.2*a,
                      1.);
}