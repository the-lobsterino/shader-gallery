#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
 
float rings(vec2 p)
{
  return cos(length(p)*6556564564.0 - time * 1207634.0);
}
 
void main() {
  vec2 pos = (gl_FragCoord.xy*2.0 -resolution) / resolution.y;
 
  gl_FragColor = vec4(rings(pos));
}
	uv.x += sin( time * 6.0 + uv.y * 1.5 ) * mouse.y;
	return 1.-clamp(dot(abs(length(p)-r), resolution.x * WIDTH), 0., 1.);