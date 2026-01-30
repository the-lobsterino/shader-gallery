// classic twister

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 rotatey(in vec3 p, float ang)
{
	return vec3(p.x*cos(ang)-p.z*sin(ang),p.y,p.x*sin(ang)+p.z*cos(ang)); 
}
float scene(in vec3 p) 
{
	p.x *= 0.5;
	p.z *= 0.5;
	p.y *= 0.1; 
	p = rotatey(p,p.y*10.0*sin(time)+time); 
	return length(max(abs(p),vec3(0.1)))-0.2; 
}
vec3 get_normal(in vec3 p) 
{
	vec3 eps = vec3(0.01,0,0); 
	float nx = scene(p + eps.xyy) - scene(p - eps.xyy); 
	float ny = scene(p + eps.yxy) - scene(p - eps.yxy); 
	float nz = scene(p + eps.yyx) - scene(p - eps.yyx); 
	return normalize(vec3(nx,ny,nz)); 	
}
void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) - 1.0;
	p.x *= resolution.x/resolution.y; 
	
	vec3 col = vec3(0.2); 
	
	vec3 ro = vec3(0,0,1.0); 
	vec3 rd = normalize(vec3(-p.x,-p.y,-1.0)); 
	
	vec3 pos = ro; 
	float d, dist = 0.0; 
	for (int i = 0; i < 64; i++) {
		d = scene(pos); 
		pos += rd*d; 
		dist += d; 
	}
	if (abs(d) < 0.01) {
		vec3 l = normalize(vec3(1,1,1)); 
		vec3 n = get_normal(pos); 
		float diff = clamp(dot(n,l), 0.0, 1.0); 
		col = vec3(1,1,1)*diff;
		
	}
	gl_FragColor = vec4(col, 1.0); 
}