#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define pi 3.14159265358979
float perlin(vec3 p) {
  vec3 i = floor(p);
  vec4 a = dot(i, vec3(1.0, 57.0, 21.0)) + vec4(0.0, 57.0, 21.0, 78.0);
  vec3 f = cos( (p - i) * pi) * (-0.5) + 0.5;
  a = mix(sin(cos(a) * a), sin(cos(1.0 + a) * (1.0 + a)), f.x);
  a.xy = mix(a.xz, a.yw, f.y);
  return mix(a.x, a.y, f.z);
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	vec3 c = vec3(0);
	for(int i = 0 ; i < 8; i++) {
		c.x += perlin(uv.xyy * float(i) + time);
		c = c.yzx;
	}
	gl_FragColor = vec4(vec4(c, 1.9));
}
