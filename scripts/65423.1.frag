#ifdef GL_ES
precision mediump float;
#endif

//----Simple raymarcher = lambert + blinn phong shading

#extension GL_OES_standard_derivatives : enable
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
struct ray{vec3 o,d;float l;};	
vec4 opu(vec4 a, vec4 b){if(a.w < b.w) return a;else return b;}	
vec4 geo(vec3 p){return opu(vec4(0.1,0.4,0.6, length(p - vec3(sin(time * 1.0)*0.2,0.,1.))-0.3),vec4(0.1,0.5,0.2, p.y+0.25));}
	
vec4 march(ray r){vec3 c = vec3(0.);
	for(int i = 0; i < 64; i++)
	{
		vec3 p = r.o + r.d * r.l;
		vec4 g = geo(p);
		r.l += g.w;
		c = g.rgb;
		if(r.l > 12.)
			break;
	}
	return vec4(c, r.l);}
float rand(vec2 n) { 	return fract(sin(dot(n, vec2(16.9898, 4.1414))) * 43758.5453);}
vec3 normal(vec3 p){	vec2 of = vec2(0.001,0.0);	float c = geo(p).w;	return normalize(c - vec3(geo(p-of.xyy).w, geo(p-of.yxy).w, geo(p-of.yyx).w));}

float lighting(vec3 p){	vec3 LPos = vec3(sin(time * 1.)*1.5,0.5,-0.);	vec3 lpos = normalize(LPos - p);	vec3 n = normal(p);	
	float l = clamp(dot(lpos,n),.1,1.);l+=pow(max(dot(lpos,n),0.),clamp(mouse.x * 90.,10.,100.))*1.0;
	float t = 0.01;float r = 1.0;for(int i = 0; i < 16; i++){	float g = geo(p+(lpos+n)*t).w;	r = min(r, 2. * g / t);	if(g < 0.001)	break;	t+=g;	if(t < 0.001 || t > 8.)	break;}l*=r;
	return l;}

void main( void ) {vec2 uv = ( gl_FragCoord.xy -0.5* resolution.xy ) /resolution.y;vec3 c = vec3(0.);
	ray r;
	r.o = vec3(0.);
	r.d = vec3(uv, 1.);
	vec4 m = march(r);
	vec3 p = r.o + r.d * m.w;
	c = m.rgb * lighting(p);
	c*=exp(-0.01 * pow(m.w,5.));
	c+=rand(uv*time)*0.05;
	gl_FragColor = vec4(c, 1.0 );}