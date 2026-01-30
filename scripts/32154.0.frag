// Da cube field
// By: xprogram

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int RAY_STEPS = 55;
const float EPSILON = 0.1;
const float MAX_DISTANCE = 120.0;
const float ZOOM = .9;

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

vec3 render(vec2 uv, vec3 cpos, vec3 cdir){
	vec3 wuv = normalize(cdir + normalize(vec3(uv, ZOOM)));
	float hdist = raymarch(cpos, wuv);
	vec3 hpos = cpos + wuv * hdist;

	if(hdist == 0.0){
		return vec3(0);
	}

	return vec3(8.0 / distance(hpos, cpos),2.0 / distance(hpos, cpos),2.0 / distance(hpos, cpos));
}

void main(){
	float aspect = resolution.x / resolution.y;
	vec3 camera_pos = vec3(15.0*cos(time), sin(time), cos(time)*5.0+time * 11.0);
	vec3 camera_dir = vec3(1.0+0.01*cos(time), mouse.x, mouse.y) / aspect;
	vec2 px = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
	px.x *= aspect;

	gl_FragColor = vec4(render(px, camera_pos, camera_dir), 1.0);
}