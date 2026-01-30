
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float phase = clamp(mouse.x, 0.0, 1.0); //mod(time*0.025, 1.0)*1.0; 
vec4 sph1 = vec4(0,0,0, 0.5); 
vec4 sph2 = vec4(0,-0.38-0.4*phase,0, 0.15); 
vec4 sph3 = vec4(0,0.3+phase,1, 0.5); 
vec2 intersectSphere(in vec3 pos, in vec3 dir, in vec4 sph, float mat)
{
    vec3 oc = pos - sph.xyz;
    float b = 2.0 * dot(dir, oc);
    float c = dot(oc, oc) - sph.w*sph.w;
    float disc = b * b - 4.0 * c;
 
    if (disc < 0.0)
        return vec2(-1.0, 0.0); 
 
    float q;
    if (b < 0.0)
        q = (-b - sqrt(disc))/2.0;
    else
        q = (-b + sqrt(disc))/2.0;
 
    float t0 = q;
    float t1 = c / q;
 
    // make sure t0 is smaller than t1
    if (t0 > t1) {
        // if t0 is bigger than t1 swap them around
        float temp = t0;
        t0 = t1;
        t1 = temp;
    }
    if (t1 < 0.0)
        return vec2(-1.0, 0.0);
    if (t0 < 0.0) {
        return vec2(t1, mat);
    } else {
        return vec2(t0, mat); 
    }
}

vec2 min2(vec2 o1, vec2 o2) {
	if (o1.x < o2.x) 
		return o1; 
	else
		return o2; 
}
vec2 sph(in vec3 p, in float r, float mat) 
{
	return vec2(length(p) - r, mat); 
}
vec2 scene(in vec3 p) {
	vec2 d = vec2(1000.0, 0); 
	d = min2(d, sph(p - sph1.xyz, sph1.w, 1.0)); 
	d = min2(d, sph(p - sph2.xyz, sph2.w, 2.0)); 
	d = min2(d, sph(p - sph3.xyz, sph3.w, 3.0)); 
	return d; 
}
vec3 get_normal(in vec3 p) {
	vec3 eps = vec3(1e-5,0,0); 
	float nx = scene(p + eps.xyy).x - scene(p - eps.xyy).x; 
	float ny = scene(p + eps.yxy).x - scene(p - eps.yxy).x; 
	float nz = scene(p + eps.yyx).x - scene(p - eps.yyx).x; 
	return normalize(vec3(nx,ny,nz)); 
}

vec3 render(in vec2 p) 
{

	vec3 col = vec3(0,0,0); 
	
	vec3 pos = vec3(0,0,1.5); 
	vec3 dir = normalize(vec3(-p.x,-p.y,-1.5)); 

	#if 0
	float dist = 0.0; 
	vec2 d; 
	for (int i = 0; i < 64; i++) {
		d = scene(pos); 
		pos += d.x*dir*1.0; 
		dist += d.x; 
	}
	#endif
	
	
	vec2 d = vec2(1000.0, 0.0); 
	vec2 d1; 
	
	d1 = intersectSphere(pos,dir,sph1, 1.0);
	if (d1.x > 0.0) 
		d = min2(d,d1); 
	d1 = intersectSphere(pos,dir,sph2, 2.0);
	if (d1.x > 0.0) 
		d = min2(d,d1); 
	d1 = intersectSphere(pos,dir,sph3, 3.0);
	if (d1.x > 0.0) 
		d = min2(d,d1); 
		
	pos = pos + d.x*dir; 
	
	if (d.x > 0.0 && d.x < 10.0) {
		vec3 n = get_normal(pos); 
		
		float dp = dot(n, vec3(0,-1.0,-0.6));  
		if (d.y == 1.0) {
			
			col = vec3(1,0.8,0.7)*pow(clamp(dp, 0.0, 1.0), 1.00)*2.0; 
			col *= 1.0*vec3(1,1,1)*pow(clamp(1.0-dot(n,vec3(0,0,1)), 0.0, 1.0), 1.00)*1.0; 
		}
		else if (d.y == 2.0) {
			col = 0.80*vec3(1,0.8,0.7); //*pow(clamp(dot(n,vec3(0,0,1)), 0.0, 1.0), 1.00)*1.4; 
			col += vec3(1,0.8,0.7)*pow(clamp(1.0-dot(n,vec3(0,0.5,1)), 0.0, 1.0), 6.00)*3.8; 
		}
		else if (d.y == 3.0) {
			col = vec3(1,0.8,0.7)*pow(clamp(dp, 0.0, 1.0), 1.00)*2.0; 
			col *= 1.0*vec3(0,0,0.4)*pow(clamp(1.0-dot(n,vec3(0,0,1)), 0.0, 1.0), 1.00)*1.0; 
		}
		
	}
	
	p.y -= 0.55+phase*0.2; 
	float ang = atan(p.y,p.x)+time*0.001; 
	float md1 = 1.0+0.0015*sin(ang*12.0); 
	float md2 = 1.0+0.0015*sin(1.2*ang*0.6); 
	//float fl = 1.0*(0.55+0.002225*sin(6.0*ang+phase*10.15)*sin(4.0*ang+phase*10.2))*md1*md2*pow(clamp(1.0 - length(p),0.0,1.0), 1.5); 
	float fl = 0.55* 1.0*pow(1.0*clamp(1.0 - length(p),0.0,1.0), 1.5)*(1.0+phase*0.05*clamp(sin(phase*10.0+ang*10.0)+sin(phase*15.0+ang*15.0),0.0,1.0));
	col += pow(phase, 0.3)*vec3(1,0.8,0.7)*fl*1.3*clamp(0.6+pow(phase, 1.0), 0.0, 1.0); 
	return col; 
}

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) - 1.0; 
	p.x *= resolution.x/resolution.y; 
	
	p.y += 0.5; 
	vec3 col = vec3(0); 
	
	float ar = 0.002; 
	for (int i = 0; i < 1; i++) {	
		float ang = 2.0*3.14159265358979*float(i)/1.0; 
		col += render(p+ar*vec2(cos(ang),sin(ang))); 
	}
	col /= 1.0; 
	gl_FragColor = vec4(col, 1.0); 
}