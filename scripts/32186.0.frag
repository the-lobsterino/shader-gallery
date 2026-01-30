// Da cube field V1.1 (with a little extra!)
// By: xprogram

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int RAY_STEPS = 70;
const float EPSILON = 0.01;
const float MAX_DISTANCE = 100.0;
const float ZOOM = 1.0;

mat3 makeRotMatrix(vec3 v){
	/*vec3 up = vec3(0, 1, 0);
	vec3 xaxis = normalize(cross(up, norm));
	vec3 yaxis = normalize(cross(norm, xaxis));

	return mat3(xaxis.x, yaxis.x, norm.x, xaxis.y, yaxis.y, norm.y, xaxis.z, yaxis.z, norm.z);*/

	float c1 = sqrt(v.x * v.x + v.y * v.y);
	float s1 = v.z;
	float c2 = (c1 != 0.0) ? v.x / c1 : 1.0;
	float s2 = (c1 != 0.0) ? v.y / c1 : 0.0;
	
	return mat3(v.x, -s2, -s1 * c2, v.y, c2, -s1 * s2, v.z, 0, c1);
}

float map(vec3 raypt){
	vec3 apt = mod(raypt, 4.0) - 2.0;

	return distance(apt, clamp(apt, vec3(-0.5), vec3(0.5)));
}

float raymarch(vec3 cp, vec3 uvd){
	float d, td = 0.0;
	vec3 rp = cp;

	for(int i = 0; i < RAY_STEPS; i++){
		d = map(rp);
		td += d;

		if(d < EPSILON){
			return td;
		}

		if(td > MAX_DISTANCE){
			return 0.0;
		}

		rp = cp + uvd * td;
	}

	// No hit
	return 0.0;
}

vec3 render(vec2 uv, vec3 cpos, mat3 cdir){
	vec3 wuv = normalize(vec3(uv, ZOOM)) * cdir;
	float hdist = raymarch(cpos, wuv);
	vec3 hpos = cpos + wuv * hdist;

	if(hdist == 0.0){
		return vec3(0);
	}

	return vec3(5.0 / distance(hpos, cpos));
}

void main(){
	vec3 camera_pos = vec3(0, time * cos(5.0), 0);
	vec3 camera_target = normalize(vec3(1, sin(time), cos(time)));
	vec2 px = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.x;

	gl_FragColor = vec4(render(px, camera_pos, makeRotMatrix(camera_target)), 1.0);
}