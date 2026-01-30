#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 iResolution = resolution;
  vec2 p = (gl_FragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);

  //float time = iAnimationTime*19.0;
  //time = 0.81*19.0-0.1+0.08*sin(iAnimationTime*TWO_PI);
  // time = iGlobalTime*1.3;
  // time = 259.8;
  float t = 0.42* abs(sin(time*cos(time)*0.06)+0.2) / abs(0.2 - length(p));
  float t2 =0.0* 0.0012* abs(cos(time*tan(time)*0.06)+0.1) / abs(0.85 - length(p));
  float t3 = 0.41* abs(tan(time*sin(time)*0.06)+0.2) / abs(0.2 - length(p));
  vec4 oColor = vec4(t2,t3,t, 1.0);
	gl_FragColor = oColor;
}