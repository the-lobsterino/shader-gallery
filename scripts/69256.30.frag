#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float inter = 300.0;
#define product(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
#define conjugate(a) vec2(a.x,-a.y)
#define divide(a, b) vec2(((a.x*b.x+a.y*b.y)/(b.x*b.x+b.y*b.y)),((a.y*b.x-a.x*b.y)/(b.x*b.x+b.y*b.y)))

void main( void ) {
	
	float w = resolution.y / resolution.x;
	vec2 p = vec2(((gl_FragCoord.x)) / resolution.x, ((gl_FragCoord.y)) / resolution.y);
	
	
	//float fact = 1.0 / pow(time,time/10.0);
	float fact = 5.0;
	//float fact = clamp(10.5 - time * 0.04, 0.0, 10.0);
	vec2 c = vec2(((p.x-0.5)* fact- mouse.x), ((p.y -0.5)* fact * w- mouse.y) );
	vec2 zk = vec2(0, 0);
	
	bool t = false;
	float it = 0.0;
	for(float k = 0.0; k < inter; k++)
	{
		if(length(zk) > 2.0)
		{
			it = k;
			t = true;
		}
		
		vec2 a = zk;
		
		for (int i = 0; i < 1; ++i) {
			a = product(a, a);
		}
		
		zk = a + c;
	}
	
	if(t)
		gl_FragColor = vec4(it / inter, 0.0, it / inter, 1.0);	
	else
		gl_FragColor = vec4(1.0, 1.0 , 1.0 ,1.0);
	
	//gl_FragColor = vec4(vec3(sin(gl_FragCoord.x/resolution.x-time)-log(mouse.x), tan(gl_FragCoord.y/resolution.y-time)+log(mouse.y), cos(time)+mouse.y), 1.0);
	//gl_FragColor = vec4(vec3(log(p.x*10.0), sqrt(p.x*mouse.y*mouse.x), log(p.y*10.0)), 1.0);
	
	//gl_FragColor = vec4(vec3(log(p.x*10.0), sqrt(p.x*mouse.y*mouse.x), log(p.y*10.0)), 1.0);
}