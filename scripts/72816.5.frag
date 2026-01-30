#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dist(vec2 a, vec2 b){
  return sqrt(pow(a.x-b.x,2.) + pow(a.y-b.y,2.));
}


void main( void ) {
	
  vec2 uv = vec2(gl_FragCoord.x/resolution.x*1.9, gl_FragCoord.y/resolution.y);
  float s = 20.;
  float c = fract(time+sin(cos(uv.y*s)*sin(uv.x*s)));
  float d = sin(dist(uv,vec2(mouse.x*1.9,mouse.y))*20.);
  
  vec4 outC = vec4(c-d,c-d,c-d,1.);
  
  gl_FragColor = outC;

}