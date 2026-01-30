#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 LIGHT_DIR = normalize(vec3(0,1.1,-0.8));
vec3 CAMERA_POS = vec3(0.0, 0.8, -1.5);

mat3 rotate3d(vec3 axis, float angle) {
	axis = normalize(axis);
	float s = sin(angle);
	float c = cos(angle);
	float oc = 1.0 - c;
    
	return mat3(oc*axis.x*axis.x+c, oc*axis.x*axis.y - axis.z*s, oc*axis.z*axis.x + axis.y*s,
		oc*axis.x*axis.y+axis.z*s, oc*axis.y*axis.y+c, oc * axis.y*axis.z - axis.x*s,
		oc*axis.z*axis.x-axis.y*s, oc*axis.y*axis.z+axis.x*s, oc*axis.z*axis.z+c);
}

float de(in vec3 p) {
	p = rotate3d(vec3(0.3,0.6,0.4),time)*p;
	
	for(int i = 0; i < 2; i++) {
		p *= normalize(p);
	}
	
	return length(p) - 0.16;
}

vec3 ray_march(in vec3 p, in vec3 dir) {
	float td = 0.0;
	for(int i = 0; i < 45; i++) {
		td += de(p + td*dir);
	}
	return p + td*dir;
}

vec3 normal(in vec3 p) {
	const vec3 E = vec3(0.00001, 0.0, 0.0);
	return normalize(vec3(
		de(p+E.xyy)-de(p-E.xyy),
		de(p+E.yxy)-de(p-E.yxy),
		de(p+E.yyx)-de(p-E.yyx)
	));
}

const float SHININESS = 3.1;
vec3 view = normalize(vec3(1.));
vec3 specular_reflection(in vec3 normal, in vec3 dir) {
 	if (dot(normal, LIGHT_DIR) < 0.0) {
     		return vec3(0.0, 0.0, 0.0);
   	}
	else {
		return vec3(1.)*pow(dot(reflect(-LIGHT_DIR, normal), view), SHININESS);
	}
}

float diffuse_factor(in vec3 normal) {
	return 2.*clamp(dot(normal, LIGHT_DIR), 0.1, 1.0);
}

vec4 color(in vec3 p) {
	vec3 norm = normal(p);
	return vec4(norm*norm,1.)*diffuse_factor(p);
}

void main( void ) {
	vec2 screen = 2.*(gl_FragCoord.xy / resolution.xy * vec2(1., resolution.y/resolution.x) - vec2(0.5));
	
	vec3 dir = normalize(vec3(screen.xy, 0.9));
	vec3 p = CAMERA_POS;
	
	vec3 end = ray_march(p, dir);
	
	gl_FragColor = 2.*(color(end)+vec4(specular_reflection(normal(end), dir),0.)/2.5)/(distance(end,p)-0.5);
}