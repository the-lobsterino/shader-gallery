#ifdef GL_ES
precision mediump float;
#endif

// JIZ FLOW
uniform vec2 resolution;
uniform float time;


const int   complexity      = 4;    // More points of color.
  mat2 rotate2d(float theta) 
{
  float s = sin(theta), c = cos(theta);
  return mat2(c, -s, s, c);
}
vec3 hsv2rgb(vec3 c) {
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main()
{
  vec2 p=(2.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y);
	p*=.95+sin(length(p*1.3)+time)*.125;
	p.x += sin(time*0.1+p.y*3.31)*0.135;
	p.y += sin(time*0.3+p.x*14.0)*0.015;
	float vv = 0.0;
	float vv2 = 0.0;
	
  for(int i=1;i<complexity;i++)
  {
	  vv*=sin(length(p*6.0)+p.x*11.5)*1.4;
	  
	  p*= rotate2d(p.y+sin(length(p)*3.25+time*0.35)*0.13);
	  vv+=sin(p.x-p.y*.3)*0.33;
	  vv2+=cos(p.y+p.x*(.12+float(i)*.156))*0.0275;
  }
	
	vec3 col = vec3(vv*0.4,vv2*2.4,abs(sin((vv2*41.0+vv)*1.15)));
	col = hsv2rgb(col);
	
	
  gl_FragColor=vec4(col, 1.0);
}