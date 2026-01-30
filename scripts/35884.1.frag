// warping hexagons, WIP. @psonice_cw
// I'm sure there's a less fugly way of making a hexagonal grid, but hey :)

//  Maybe - Try this...

// Simplify!

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

float pro(float v)
{
	float p= cos(v*3.14);

	for(int i = 1; i<6;i++)
	{
		p = (p+cos(3.14*p+sin(v/float(i))*6.28)/float(i))*0.5;
		
	}
	return  sin(6.28/(p+2.));
}

// 1 on edges, 0 in middle
float hex(vec2 p) {
  p.x *= 0.57735*2.0;
	p.y += mod(floor(p.x), 2.0)*0.5;
	p = abs((mod(p, 1.0) - 0.5));
	return abs(max(p.x*1.5 + p.y, p.y*2.0) - 1.0);
}

void main(void) {
	vec4 baseColor = vec4(0.0, 0.0, 1.0, 1.0);
	vec2 pos = gl_FragCoord.xy;
	vec2 wrp = 1.5*(sin(time))*vec2(sin(time+pos.x*0.025),cos(time+pos.y*0.025))+vec2(pro(time*1.1),pro(time*0.9));
	vec2 p = pos/20.0; 
	float  r = (1.0 -0.7)*0.5;
	vec4 finalColor = baseColor * vec4(smoothstep(r, 0.0, hex(p+wrp)));
	gl_FragColor = finalColor;
}