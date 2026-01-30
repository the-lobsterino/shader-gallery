#ifdef GL_ES
precision highp float;
#endif
precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float radius = 0.3;
const float radius2 = 0.3 * 0.3;
const float pi = 3.14159265;

const vec3 light_pos = vec3(5.0,5.0,-5.0);

const  vec3 ambient = vec3(0.1, 0.1, 0.1);

const vec3 ball_color = vec3(0.8, 0.8, 0.8);
const  float diffuse = 0.4;
const  float specular = 1.0;

const float shininess = 10.0;

vec3 shade(vec3 pos, vec3 norm, vec3 dir, out vec3 refl) {
	vec3 color = ambient;
	float c1 = -dot(dir, norm);
	vec3 l = normalize(light_pos - pos);
	float diff = dot(norm, l);
	diff = clamp(0.0, diff, 1.0);
	color += diff * diffuse * ball_color;
	
	refl = normalize(dir  + 2.0 * c1 * norm);
	float spec = dot(refl, l);
	spec = clamp(0.0, spec, 12.0);
	spec = pow(spec, shininess);
	color += spec * specular * ball_color;
	return color;
}

vec3 floor_texture(vec2 uv) {
	uv = mod(uv, 2.0);
	ivec2 iv = ivec2(uv);
	if (iv.x + iv.y == 1) {
		return vec3(1.0,.0, .0);	
	} else {
		return vec3(1.0, 1.0, 1.0);
	}	
}


bool intersect(vec3 ro, vec3 rd, vec3 origin, float nearest_t, out vec3 pos, out vec3 normal, out float t) {
	vec3 o = ro - origin;
	vec3 d = rd;
	float os = dot(o,o);
	if (os > (nearest_t + radius ) * (nearest_t + radius))
		return false;
	
	float b = 2.0 * dot(d, o);
	float c = os - radius2;
	float discr = b * b - 4.0 * c;
	if (b > 0.0) return false;
	if (discr <= 0.0) return false;
	
	float q = (-b  + sqrt(discr)) * 0.5;
	
	float t0 = q;
	float t1 = c / q;
	if (t1 < 0.0)
		t = t0;
	else 
		t = t1;
	if (t <= 0.001) return false;
	pos = ro  + rd * t;
	normal = (o + t * d) / radius;
	return true;
}

vec3 background(vec3 ro, vec3 rd) {
	if (rd.y >= 0.0) {
		return vec3(0.5, 0.5, 1.0);
	}
	float floor_y = -4.0;
	// Plane projection:
	
	const vec3 abc = vec3(0.0, 1.0, 0.0);
	
	float a = dot(abc, ro) + floor_y;
	float b = dot(abc, rd);
	float t = -a/b;
	
	vec3 pp = ro + t * rd;
	vec3 useless;
	
	vec3 tex = floor_texture(vec2(pp.x, pp.z));
	vec3 s = shade(pp, abc, rd, useless);
	return s * tex;
	
}

void main( void ) {
	
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv = uv * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	
	
	gl_FragColor.a = 1.0;
	
	// using an iq styled camera this time :)
	// ray origin
	vec3 ro = 0.7 * vec3(cos(0.2 * time), 0.0, sin(0.2 * time));
	ro.y = cos(0.6 * time) * 0.3 + 0.65;
	
	ro = vec3(0, 1, -1.5);
	// camera look at
	vec3 ta = vec3(0.0, 1, 0.0);
	
	// camera shake intensity
	float shake = clamp(3.0 * (1.0 - length(ro.yz)), 0.0, 0.0);
	float st = mod(time, 10.0) * 143.0;
	
	// build camera matrix
	vec3 ww = normalize(ta - ro);
	vec3 uu = normalize(cross(ww, normalize(vec3(0.0, 1.0, 0.2 * cos(time)))));
	vec3 vv = normalize(cross(uu, ww));
	
	// obtain ray direction
	vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.0 * ww);
	
	
	vec3 ball_pos[3];
	
	const float spin = 0.8;
	const float spin_speed = 2.0;
	float t = time * spin_speed;
	for (int i = 0; i < 3; ++i) {
		ball_pos[i] = spin * vec3(sin(t),  2.0 + cos(t), sin(t) * sin(t));
		t += pi * 0.3333;
	};
		
	float nearest_t = 3.0;
	t = 0.0;
	
	

	gl_FragColor.rgb = vec3(0.0, 0.0, 0.0);
	float mul = 1.0;
	for (int j = 0; j < 3; ++j) {
		bool hit = false;
		vec3 hit_pos;
		vec3 refl;
		for (int i = 0; i < 3; ++i) {
			vec3 pos;
			vec3 normal;
			vec3 b = ball_pos[i];
			if (intersect(ro, rd, b, nearest_t, pos, normal, t)) {
				hit_pos = pos;
				gl_FragColor.rgb += mul * shade(pos, normal, rd, refl);
				nearest_t = t;
				hit = true;
			}
		}
		if (!hit) {
			gl_FragColor.rgb += background(ro, rd) * mul;	
			break;
		} else {
			ro = hit_pos;
			rd = refl;
			
		}
		mul *= 0.5;
	}
}