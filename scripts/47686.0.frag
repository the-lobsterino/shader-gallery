#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
#define mouse vec2(time/90., 0.)
uniform vec2 resolution;

uniform sampler2D texture; 

vec3 rotatey(in vec3 p, float ang) { return vec3(p.x*cos(ang)-p.z*sin(ang),p.y,p.x*sin(ang)+p.z*cos(ang));  }
vec3 rotatex(in vec3 p, float ang) { return vec3(p.x,p.y*cos(ang)-p.z*sin(ang),p.y*sin(ang)+p.z*cos(ang));  }
vec3 rotatez(in vec3 p, float ang) { return vec3(p.x*cos(ang)-p.y*sin(ang),p.x*sin(ang)+p.y*cos(ang),p.z);  }

vec2 sph(in vec3 p, float r, float o) { return vec2(length(p)-r, o); }
vec2 rbox(in vec3 p, in vec3 b, float r, float o) { return vec2(length(max(abs(p)-b,0.0))-r, o); }
vec2 sdbox( vec3 p, vec3 b, float o ) { vec3 d = abs(p) - b; return vec2(min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0)), o); }
vec2 plane(in vec3 p, in vec3 n, float d, float o) { return vec2(dot(p,n)-d, o); }

vec2 min2(in vec2 o1, in vec2 o2) { if (o1.x < o2.x) return o1; else return o2; }
vec2 max2(in vec2 o1, in vec2 o2) { if (o1.x > o2.x) return o1; else return o2; }
vec2 scene(in vec3 p)	
{
	vec2 d = vec2(1000.0, 0); 
	d = min2(d, vec2(-1,1)*rbox(p-vec3(0,0,0), vec3(6,3,4), 4.0,3.0));	
	p.x = mod(p.x+1.0,2.0)-1.0;
	p.y = mod(p.y+1.0,2.0)-1.0;
	d = min2(d, vec2(1,1)*sph(p-vec3(0,0,2), 1.0, 3.0));
	return d; 
}

vec3 get_tex(in vec3 p)
{
	if (abs(p.y+1.9) < 0.01)  return vec3(0.2);
	if (abs(p.y-0.8) < 0.01)  return vec3(0.2);
	
	if (abs(p.x+2.0) < 0.8 && p.y > -1.9 && p.y < 0.8) return vec3(0.1);
	if (abs(p.x+5.0) < 0.4 && p.y > -1.9 && p.y < 0.8) return vec3(0.1);
	if (abs(p.z-1.0) < 0.4 && p.y > -1.9 && p.y < 0.8) return vec3(0.1);
	
	if (abs(p.z-0.1) < 0.01 && p.y > 0.99) return vec3(0.1);
	if (abs(p.z-2.0) < 0.01 && p.y > 0.99) return vec3(0.1);
	if (abs(p.x-1.5) < 0.01 && p.y > 0.99) return vec3(0.1);
	return vec3(1);
}
vec3 get_normal(in vec3 p)
{
	vec3 eps = vec3(0.001, 0, 0); 
	float nx = scene(p + eps.xyy).x - scene(p - eps.xyy).x; 
	float ny = scene(p + eps.yxy).x - scene(p - eps.yxy).x; 
	float nz = scene(p + eps.yyx).x - scene(p - eps.yyx).x; 
	return normalize(vec3(nx,ny,nz)); 
}

// ambient occlusion approximation
// multiply with color
float ambientOcclusion(vec3 p, vec3 n)
{
    const int steps = 3;
    const float delta = 0.5;

    float a = 0.0;
    float weight = 1.0;
    for(int i=1; i<=steps; i++) {
        float d = (float(i) / float(steps)) * delta; 
        a += weight*(d - scene(p + n*d).x);
        weight *= 0.5;
    }
    return clamp(1.0 - a, 0.0, 1.0);
}

float random(vec3 scale, float seed) { 
	return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed); 
} 

vec3 uniformlyRandomDirection(float seed) { 
	float u = random(vec3(12.9898, 78.233, 151.7182), seed); 
	float v = random(vec3(63.7264, 10.873, 623.6736), seed); 
	float z = 1.0 - 2.0 * u; float r = sqrt(1.0 - z * z); 
	float angle = 6.283185307179586 * v; 
	return vec3(r * cos(angle), r * sin(angle), z); 
} 

vec3 uniformlyRandomVector(float seed) { 
	return uniformlyRandomDirection(seed) * sqrt(random(vec3(36.7539, 50.3658, 306.2759), seed)); 
} 

vec3 rm(in vec3 ro, in vec3 rd, float time)
{
	vec3 colorMask = vec3(1.0); 
	vec3 color = vec3(0.0);  
	vec3 surfaceColor = vec3(0);
	vec3 tex = vec3(0);
		vec3 pos = ro; 
		float dist = 0.0; 
		vec2 d = vec2(0); 
		
		for (int i = 0; i < 80; i++) {
			d = scene(pos); 
			pos += rd*d.x;
			dist += d.x; 
		}
		if (dist < 10000.0 && abs(d.x) < 100.0) {
			float o = d.y;
			vec3 n = get_normal(pos); 
			float shade = ambientOcclusion(pos+0.01*n, 1.0*n)*0.5+0.5;
			shade *= 1.0+0.4*sin(-1.0+1.0*pos.z);
			shade *= 1.0+0.4*sin(-1.0+0.5*pos.x);
			shade *= 1.0+0.4*sin(-2.0+0.5*pos.y);
			//tex = get_tex(pos);

			#define MULTISAMPLE_TEX 1
			if (true) {
			#if MULTISAMPLE_TEX
			tex = vec3(0);
				for (int i = 0; i < 16; i++) {
					float AA = 0.01; 
					tex += get_tex(pos + AA*uniformlyRandomVector(float(time)+float(i))); 
				}
				tex /= 16.0;
			#else
				tex = get_tex(pos); 
			#endif
			}
				
				
			if (d.y == 1.0) {
				// Light, luminance
				surfaceColor = vec3(1,1,1)*0.8; 
			}
			if (d.y == 2.0) {
				surfaceColor = vec3(1,0,0); 
			}
			if (d.y == 3.0) {
				surfaceColor = vec3(1,1,1); 
			}
			//colorMask *= surfaceColor;
			color += 0.5*shade*surfaceColor; //*colorMask; 
			
		}	
	return color*tex; 
}

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0;
	p.x *= resolution.x/resolution.y; 

	#define CROP_Y 1
	#if CROP_Y 
	if (abs(p.y) > 0.75) { gl_FragColor = vec4(0); return; }
	#endif
	
	p.xy += uniformlyRandomVector(time).xy*0.001; 

	vec3 campos = vec3(sin(time)*10.0,1,0); 
	vec3 camtar = vec3(0,1,1); 
	vec3 camup = vec3(0,1,0);
	
	vec3 camdir = normalize(camtar-campos);
	vec3 cu = normalize(cross(camdir, camup)); 
	vec3 cv = normalize(cross(cu, camdir)); 
	
	vec3 color = vec3(0.0); 
	
	vec3 ro = vec3(0,-0.9,2.0);
	vec3 rd = normalize(vec3(p.x,p.y,-2.0)); 

	vec2 tmouse = vec2(10.6+time*0.001, 3.7+time*0.002);
	tmouse = vec2(mouse.x,mouse.y);
	ro = rotatex(ro, tmouse.y*0.0); 
	rd = rotatex(rd, tmouse.y*0.0);
	ro = rotatey(ro, tmouse.x*10.0); 
	rd = rotatey(rd, tmouse.x*10.0);
	
	color += rm(ro, rd, time); 
	#define GAMMA 1
	#if GAMMA
	color = pow(color,vec3(0.3));
	#endif
	color += uniformlyRandomVector(time)*0.05;
	color = mix(color, texture2D(texture,gl_FragCoord.xy/resolution.xy).xyz, 0.5);
	gl_FragColor = vec4(color, 1.0); 
}
