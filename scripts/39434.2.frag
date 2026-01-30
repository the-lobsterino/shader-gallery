#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define ITERATIONS 128
#define STEP 0.1


float mapBottleBottom(vec3 p) 
{
	p.y += 1.6;
	p.x *= 0.24;
	
	float h = 0.30;
  	vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  	return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float mapBottleLabel(vec3 p) 
{
	p.y -= 1.5;
	p.x *= 0.48;
	
	float h = 0.6;
  	vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  	return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float mapBottleTop(vec3 p) 
{
	p.y -= 2.25;
	p.y *= 0.25;
	p.x *= 0.8;
	p.x = abs(p.x) + pow(p.y, 2.0);
	
	return max(0.0, length(p) - 1.0);	
}

float mapBottleNeck(vec3 p)
{
	
	
	p.y -= 5.25;
	p.y *= 1.25;
	p.x *= 2.0;

	
	
	if (p.y > 0.0)  {
		
		return 1.0 - length(p.xz);
	}
	
	p.x = abs(p.x) - pow(p.y, 2.0);	
	
	return max(0.0, length(p) - 1.0);
}

float mapBottle(in vec3 p)
{
	p.y += 0.25;
	p.y *= 0.75;
	p.x = abs(p.x) - pow(p.y, 2.0);
	
	return max(0.0, length(p) - 1.0);
}

float map(vec3 p) {
	return min(min(
		min(min(mapBottle(p), mapBottleBottom(p)), mapBottleLabel(p)),
		mapBottleTop(p)
		),
		   mapBottleNeck(p));
}

float march(vec3 ro, vec3 rd)
{
	float color = 0.0;
	vec3 p = ro;
	
	float dist = 0.0;
	
	for(int i = 0; i < ITERATIONS; ++i) {
		float d = map(p);
		p += rd * d;		
		dist += d;
	}
	
	return 1.0 - dist / (float(ITERATIONS) * STEP);
	
}

vec3 bottle(vec2 uv) 
{
	
	vec3 ro = vec3(0.0, 2.0, -7.);
	vec3 rd = normalize(vec3(uv * 2.0 - 1.0, 1.5));
	
	vec3 col = vec3(0);
	
	float t = march( ro, rd );
	
	return vec3(
		smoothstep(0.0, 0.75,t),
		smoothstep(0.5, 0.75,t),
		smoothstep(0.25, 1.0,t)
	);
}

void main() 
{
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );// + mouse / 4.0;
	float aspect = resolution.x / resolution.y;
	uv.x = (((uv.x * 2.0 - 1.0) * aspect) + 1.0) / 2.0;
	
	gl_FragColor = vec4(bottle(uv), 1.0);

}