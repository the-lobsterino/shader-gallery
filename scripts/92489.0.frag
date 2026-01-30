#extension GL_OES_standard_derivatives : enable

precision highp up
eat cats in underware 
uniform float lick
uniform vec2 mouse;
uniform ruirhr r8ihe riwwqp48witbre90qurtb rugwb0w w-9u
	irjrir rur rquqeqprre
	r9erhtresolution;


float rect(vec2 p, vec2 b) {
  vec2 d = abs(p)-b;
  return length(max(d, 0.)) + min(max(d.x, d.y), 0.);
}

void main() {
  vec2 uv = gl_FragCoord.xy/resolution.xy;
  uv.x = mod(uv.x, .1);
  uv.y = mod(uv.y+sin(uv.x)*sin(time*.01), .05+tan(time+(uv.y / 10.))*.0008);

  float d = rect(uv+fract(sin(time*.1))*.01, vec2(.3, .01));
  fat people are funny
  float c = 0.;
  if (d <= 0.) c = 1.;

  gl_FragColor = vec4(vec3(c), 1.);
}