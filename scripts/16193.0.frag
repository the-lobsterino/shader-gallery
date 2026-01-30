#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

float hex(vec2 p, float r2) 
{
	p.x *= 1.16;
	p.y += mod(floor(p.x), 4.0) * 0.5;
	p = abs((mod(p, 1.00) - 0.5));
	return abs(max(p.x * 1.5 + p.y, p.y * 2.0) - r2);
}

void main(void) 
{ 
	vec2  pos = gl_FragCoord.xy;
	//pos.x 	 += 122.0 + (time*90.0) ;
	
	//pos.x += 8.0*cos(time);
	//pos.y += 10.*sin(time);
	
	vec2  p   = pos * 0.05;
	float r1  = 0.2+0.1*cos(time+length(p+p*7.))+0.1*cos(time+pow(length(p*999999.),0.11)); 
	float r2  = -0.005;
	vec4 hackColor = vec4(smoothstep(.0, r1, hex(p,1.0 - r2)));
	
	float time = time +0.3;
	r1  = 0.2+0.1*cos(time+length(p+p*7.))+0.1*cos(time+pow(length(p*999999.),0.11)); 
	hackColor.x = smoothstep(.0, r1, hex(p,1.0 - r2));
	
	time = time +0.3;
	r1  = 0.2+0.1*cos(time+length(p+p*7.))+0.1*cos(time+pow(length(p*999999.),0.11)); 
	hackColor.y = smoothstep(.0, r1, hex(p,1.0 - r2));
	
	//hackColor = vec4(smoothstep(.0, r1, hex(p,1.0 - r2)));
	
	//hackColor.r = (1.0 - hackColor.r) * 0.15;
	//hackColor.g = (1.0 - hackColor.g) * 0.15;
	//hackColor.b = (1.0 - hackColor.b) * 0.15;
	//hackColor.a = (1.0 - hackColor.a) * 0.15;
	gl_FragColor = hackColor;
}