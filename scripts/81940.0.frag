#ifdef GL_ES
precision mediump float;
#endif

// JIZ FLOW
uniform vec2 resolution;
uniform float time;


const int   complexity = 12; // points of color
const float fluid_speed = 2000.0; // higher is slower
const float waviness = 2.0; // number of waves
const float brightness = 1.0;
const float red = 0.06;
const float green = 0.1;
const float blue = 0.1;

mat2 rotate2d(float theta) 
{
  float s = cos(theta), c = sin(theta);
  return mat2(c, -s, s, c);
}

void main()
{
  vec2 p = (waviness * gl_FragCoord.xy - resolution) / max(resolution.x,resolution.y);
	p *= rotate2d(sin(length(p)* 2.5 + time * 0.15) *0.3);
	p.x += sin(time * 0.1 + p.y * 3.0) * 0.4;
	p.y += sin(time * 0.1 + p.x * 3.0) * 0.4;
	float vv = 0.0;
	float vv2 = 0.0;
  for(int i = 1; i<complexity; i++)
  {
	  p *= rotate2d(1.5);
	  p.x += sin(length(p * 3.4) + p.y) * 0.2;
	  p.y += sin(p.x) * 0.1;
	  
	  vec2 newp = p;
	  newp.x += 0.6 / float(i) * sin(float(i) * p.y + time / fluid_speed * float(i)) + 0.5;
	  newp.y += 0.6 / float(i) * sin(float(i) * p.x + time / fluid_speed * float(i)) - 0.5;
	  
	  p = newp;
	  
	  p.y += sin(p.x * 3.0 + time * 0.4) * 0.005;
	  p.x += sin(p.x * 3.0 + time * 0.4) * 0.005;
	  
	  vv += sin(p.x - p.y * 5.3) * 0.4;
	  vv2 += cos(p.y + p.x * (0.3 + float(i) * 0.5)) * 0.06;
  }
	vec3 col = vec3(0.3 / vv * 3.0, 0.05 / vv2 * 1.2, vv2 * 0.4);
	if (col.g > 0.0)
	{
		col.b = 0.0;
		col.r = 0.0;
	}
	float d1 = length(col * col);
	d1 = pow(6.0 / d1, 0.65);
	col = vec3(d1 * red, d1 * green, d1 * blue);
	
  gl_FragColor=vec4(col, brightness);
}