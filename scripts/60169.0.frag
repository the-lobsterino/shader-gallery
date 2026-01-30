// it made them cunt

#ifdef GL_ES
  precision mediump float;
#endif

// 1.0 on edges, 0.0 in middle
float hexGrid(vec2 p)
{
	p.x -= sin(p.y*1.1);
	p.y -= sin(p.x-0.42);
  p.x *= 1.1547;
  p.y += mod(floor(p.x), 2.)*0.5;
  p = abs((mod(p, 1.0) - 0.5));
  return abs(max(p.x*1.5 + p.y, p.y*2.0)-1.0);
}

void main(void) 
{
  float k = smoothstep(0.2, 0.0, hexGrid(0.02*gl_FragCoord.xy));
  gl_FragColor = k * vec4(0.8, 0.4, 1.0, 1.0)*k;
}