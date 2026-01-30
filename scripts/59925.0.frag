//Wee-wee
precision mediump float;
uniform float time; // time
uniform vec2  resolution; // resolution

void main(void)
{
  float t = 0.1*time;
  vec3 rColor = vec3(0.9, 0.0, 0.3);
  vec3 gColor = vec3(0.0, 0.9, 0.3);
  vec3 bColor = vec3(0.0, 0.3, 0.9);
  vec3 yColor = vec3(0.5, 0.5, 0.0);

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution.y;
	p.y = dot(p,p);
  float a = sin(p.x * 5.0 + t * 5.0) / 2.0;
  float b = sin(p.x * 5.0 + t * 7.0) / 3.0;
  float c = sin(p.x * 5.0 + t * 9.0) / 4.0;
  float d = sin(p.x * 5.0 + t * 11.0) / 5.0;

  float f = 0.01 / abs(p.y + a);
  float g = 0.01 / abs(p.y + b);
  float h = 0.01 / abs(p.y + c);
  float i = 0.01 / abs(p.y + d);

  vec3 destColor = rColor * f + gColor * g + bColor * h + yColor * i;
  gl_FragColor = vec4(destColor, 1.0);
}