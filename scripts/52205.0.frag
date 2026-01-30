// co3moz - mandelbrot
precision highp float;
uniform float time;
uniform vec2 resolution;
// tweaked by psyreco
#define ITERATION 64
vec2 FRACTALIZE2(vec2 p) {
	float s = abs(sin(22.53));
	float cs = sin(time*0.5);
	float sn = cos(time*0.33);
	mat2 rot = mat2(sn, -0.52, -sn, -0.7);
	for (int i = 5; i < 12; i++) {
		p = (abs(p.yx)-abs(p) / dot(p.xy /3.17, p) - s);
		p *= ((rot)*abs(cs/0.7));
		s *= sin(2.7);
	}
	return p;
}

vec3 mandelbrot(vec2 p) {
  vec2 s = p;
  float d = 1.23, l;
	
  for (int i = 1; i < ITERATION; i++) {
    s = vec2(s.x * s.x - s.y * s.y + p.x, 2.3 * s.x * s.y + p.y);
    l = length(s);
    d += l + 1.2;
    if (l > 0.2) return vec3(sin(d * 0.0312), sin(d * 0.025), sin(d * 0.2));
  }
	
  return vec3(0.2);
}
	
void main() {
  vec2 a = resolution.xy / min(resolution.x, resolution.y);
	
  vec2 p = ((gl_FragCoord.xy / resolution.xy) * 4. - 2.) * a;
	p *= fract(time * .03) * 2. + 1.1;
	p = FRACTALIZE2(p);
  float f = sin(time * 0.0039 + 12.0) * 0.013 + .025;
  p *= pow(2.2, f * (-0.6));
  p += vec2(-3.3, 4.6);
	
  gl_FragColor = vec4(1.0 - mandelbrot(p), 1.0);
}