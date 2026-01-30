// dogshit edits 4 u...


#ifdef GL_ES
precision highp float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define MAX_ITER 4.0

float Turb(vec2 p)
{
	p*=0.325;
	float ti = time*0.225;
	p.y += ti;
	vec2 i = p;
	
	float c = -0.1;
	float inten = 0.15;
	float r = length(p+vec2(sin(ti),sin(ti*0.433))*2.);
	
	for (float n = 0.0; n < MAX_ITER; n++)
	{
		float t = r-ti * (1.0 - (1.9 / (n+1.)));
		      t = r-ti/(n+0.6);//r-time * (1.0 + (0.5 / float(n+1.)));
		i -= p.yx + vec2(
			cos(t*0.1 - i.x-r) + sin(t*0.1 + i.y), 
			sin(t*0.7 - i.y) + cos(t*0.4 + i.x)+r
		);
		c += 1.0/length(vec2(
			(sin(i.x+t)/inten),
			(cos(i.y+t)/inten)
			)
		);
	
	}
	c = smoothstep(0.0,1.0,c*0.95);
	return c * 0.35;
	
}


float map(vec3 p)
{
	//p.x *= 0.4;
	p.x + sin(p.z+time)*0.5;
	float k = Turb(p.xz);
	return 3.5 -abs(p.y) - k;
}

vec3 normal(vec3 p) {
	vec2 e = vec2(.001, 0.);
	vec3 n;
	n.x = map(p + e.xyy) - map(p - e.xyy);
	n.y = map(p + e.yxy) - map(p - e.yxy);
	n.z = map(p + e.yyx) - map(p - e.yyx);
	return normalize(n);
}

vec3 render(vec2 uv) {
	
	vec3 ro = vec3(sin(time)*0.25, cos(time)*0.25, time*0.75);
	vec3 rd = normalize(vec3(uv, .5));
	vec3 p = vec3(0.);
	
	
	
	float t = 0.;
	for (int i = 0; i < 80; i++) {
		p = ro + rd * t;
		float d = map(p);
		if (d < .001 || t > 100.) break;
		t += .5 * d;
	
	}
	
	vec3 l = ro;
	vec3 n = normal(p);
	vec3 lp = normalize(l - p);
	float diff = .5 * max(dot(lp, n), 0.);
	
	return vec3(diff*0.7,diff*1.62,diff*3.1) / (1. + t * t * .01);

}

void main()
{
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = render(uv);
	gl_FragColor = vec4(col, 1.);
}

