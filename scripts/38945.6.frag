#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

precision mediump float;
uniform vec2      resolution;
uniform float     time;
uniform vec2      speed;
uniform float     shift;

float rand(vec2 n) {
  	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) {
	  const vec2 d = vec2(0.0, 1.0);
	  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	  return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) {
	return noise(n)* 0.5 + 
		noise(n * 2.0) * 0.25 + 
		noise(n * 4.0) * 0.125 + 
		noise(n * 8.0) * 0.065;
}

void main() {
    vec2 p = gl_FragCoord.xy * 8.0 / resolution.xx;
	
    float r = fbm(p - vec2(0.0, fbm(p) + time * 0.5));
    gl_FragColor = vec4(r);
}