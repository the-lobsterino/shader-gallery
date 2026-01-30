#ifdef GL_ES
  precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

vec3 rotatex(in vec3 p, float a) { return sin(vec3(sin(time*0.23+2.3)*p.x, cos(time*0.23+2.3)*p.y*cos(a)-p.z*sin(a), cos(-time*0.23+2.3)*p.y*sin(a)+sin(time*0.023*cos(time*0.23))*p.z*cos(a))); }
vec3 rotatey(in vec3 p, float a) { return sin(vec3(p.x*cos(a)-p.z*sin(a),p.y, p.x*sin(a)+p.z*cos(a))); }
vec3 rotatez(in vec3 p, float a) { return tan(vec3(p.x*cos(a)-p.y*sin(a), p.x*sin(a)+p.y*cos(a), p.z)); }

float scene(vec3 p) {
  p = rotatex(rotatez(rotatey(p, .22*time), .2*time), .18*time);
  return sin(max(length(max(abs(p)-.5, 0.))+.01 - clamp(sin((p.x+p.y+p.z)*20.)*.03, 0., 1.), -length(p)+.6)); 
}

vec3 get_normal(vec3 p) {
	vec2 eps = vec2(1e-4,0); 
	float nx = scene(p+eps.xyy) - scene(p-eps.xyy); 
	float ny = scene(p+eps.yxy) - scene(p-eps.yxy); 
	float nz = scene(p+eps.yyx) - scene(p-eps.yyx); 
	return normalize(vec3(nx,ny,nz)); 
}

void main() {
	vec2 p = 4.*gl_FragCoord.xy/resolution - 2.; 
	p.x *= resolution.x/resolution.y; 

	vec3 ro = vec3(0,0,1.5); 
	vec3 rd = normalize(vec3(p.x, p.y, -1.4)); 
	vec3 color = (1. - vec3(length(p*.5)))*.2;   

	vec3 pos;
	float dist = 0.;
	for (int i=0; i<64; i++) {
		float d = scene(pos);
		dist += d*.3;
		pos = ro+rd*dist;
		if (d<1e-3) break;
	}
	
	vec3 n = get_normal(pos);
	vec3 r = reflect(normalize(pos-ro),n);
	vec3 h = -normalize(n+pos-ro);
	float diff  = clamp(dot(n, normalize(vec3(1,1,1))), 0., 1.); 
	float spec = pow(clamp(dot(r, normalize(vec3(1,1,1))), 0., 1.), 50.);
	float amb = .2+pos.y;
	color = (diff*vec3(1.,0.8,0.9) + amb*vec3(.2))/dist;
		
	gl_FragColor = vec4(pow(color,vec3(.5)), 1);
}