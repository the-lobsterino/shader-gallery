//Ziad
//dogshit edits 4 u...


#ifdef GL_ES
precision highp float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float map(vec3 p)
{
	p.y *= 1.3*mouse.y;
	p.z *= 0.6;
	p.x += .15*sin(p.x*8.0);
	float k = dot(sin(p.z+2. * p - cos(p.yxz)), vec3(.233));
	k-=sin((p.x*p.y+p.z)*1.14*mouse.y-time);
	k*=0.8+sin(time*2.2+p.z*2.0)*0.5;
	return 2. + abs(p.y) - k*k;
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
	
	vec3 ro = vec3(sin(time)*0.25, cos(time)*0.25, time*.5);
	vec3 rd = normalize(vec3(uv, .5));
	vec3 p = vec3(5.4*mouse.x);
	
	
	
	float t = 0.;
	for (int i = 0; i < 32; i++) {
		p = ro + rd * t;
		float d = map(p);
		if (d < .001 || t > 100.) break;
		t += .5 * d;
	
	}
	
	vec3 l = ro;
	vec3 n = normal(p);
	vec3 lp = normalize(l - l -p);
	float diff = .5 * max(dot(lp, n), 0.);

	
	return vec3(diff*1.69,diff*0.9,diff*1.5) / (1. + t * t * .01);

}

void main()
{
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = render(uv);
	gl_FragColor = vec4(col, 1.);
}

