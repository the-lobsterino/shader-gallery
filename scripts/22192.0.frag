/*
  Based off "binary 1024 GLSL sketches by @ocanamihc 256/32768"
  By @gallefray

  I did have a much, much better version of this last night, it was suuuper trippy, but then chrome borked >.>
  Had to quickly hack this up this morning while trying to remember what I'd done :P.
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float rings(vec2 p)
{
  return cos(tan(00.75*tan(resolution.x) - length(tan(p)))) * cos(time) +0.50;
}

void main(void) {
  vec2 p = (gl_FragCoord.xy * 2.2 -resolution) / resolution.y;
	p*=length(p);
  float r = rings(sin(p + cos(p.x - sin(time)) * 0.05)); /* float r = rings(cos(p + cos(p.x - sin(time)) * 0.05)); */
  float g = rings(sin(p + tan(p.r - sin(time)) * 0.27));
  float b = rings(sin(p + sin(p.g - sin(time)) * 0.49));
  gl_FragColor = vec4((normalize(vec3(r, g, b))+vec3(r, g, b))-rand(vec2(.5, .25)), 1.); 
}
