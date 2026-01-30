#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 lightDir = vec3(-.57, .57, .57);
const float radius = 1.;

mat2 rot(float r){
	float c = cos(r);
	float s = sin(r);
	return mat2(c, s, -s, c);
}

float sphere(vec3 p){
	return length(p) - radius;
}

float torus(vec3 p){
	p.yz *= rot(1.5);
	vec2 t = vec2(.75, .25);
	vec2 r = vec2(length(p.xy) - t.x, p.z);
	return length(r - vec2(0., 0.)) - t.y;
}

float dfloor(vec3 p){
	return p.y + 1.;
}

float box(vec3 p, vec3 size){
	return length(max(abs(p) - size, 0.)) - .03;
}

float cylinder(vec3 p, vec2 r){
	vec2 d = abs(vec2(length(p.xy), p.z)) - r;
	return min(max(d.x, d.y), 0.) + length(max(d, 0.)) - .1;
}

/**
距離関数分かんね～
*/
float curve(vec3 p){
	return 1. / abs(min(length(p), 1.));
}

vec3 trans(vec3 p){
	return mod(p, abs(sin(time) * .25)) - .1;
}

float distFunc(vec3 p){
	float d1 = torus(p);
	float d2 = dfloor(p);
	return min(d1, d2);
}
		
vec3 getNormal(vec3 p){
	float d = .001;
	return normalize(vec3(
		distFunc(p + vec3(d, 0., 0.)) - distFunc(p + vec3(-d, 0., 0.)),
		distFunc(p + vec3(0., d, 0.)) - distFunc(p + vec3(0., -d, 0.)),
		distFunc(p + vec3(0., 0., d)) - distFunc(p + vec3(0., 0., -d))
	));
}

/**
第一引数 : レイとオブジェクトの交差位置
第二引数 : 光源に向けて飛ばすベクトル(ライトベクトル)
*/
float genShadow(vec3 ro, vec3 rd){
	float h = 0.;
	float c = .001;
	float r = 1.;
	float shadowCoef = .5;
	for(float t = 0.; t < 50.; t++){
		h = distFunc(ro + rd * c);
		if(h < .001){
			return shadowCoef;
		}
		r = min(r, h * 16. / c);
		c += h;
	}
	return 1. - shadowCoef + r * shadowCoef;
}

void main( void ) {
	
	vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
	
	vec3 cPos = vec3(0., 0., 3.);
	cPos.y += 1.5;
	vec3 cTar = vec3(0., 0., 0.);
	vec3 cDir = normalize(cTar - cPos);
	vec3 cUp  = vec3(0., 1., 0.);
	vec3 cSide = cross(cDir, cUp);
	float targetDepth = 1.;
	
	vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
	vec3 light = normalize(lightDir + vec3(sin(time), 0., 0.));
	
	float depth = 0.;
	vec3 rayPos = cPos;
	vec3 destColor = vec3(0.);
	float shadow = 1.;
	
	for(int i=0; i<128; i++){
		float t = distFunc(rayPos);
		depth += t;
		rayPos = cPos + ray * depth;
		if(abs(t) < .001){
			vec3 normal = getNormal(rayPos);
			
			vec3 halfLE = normalize(light - ray);
			float diff = clamp(dot(lightDir, normal), .1, 1.);
			float spec = pow(clamp(dot(light, normal), .1, 1.), 50.);
			
			shadow = genShadow(rayPos + normal * .001, light);
			
			float u = 1. - floor(mod(rayPos.x, 2.));
			float v = 1. - floor(mod(rayPos.y, 2.));
			if((u == 1. && v < 1.) || (u < 1. && v == 1.)){
				diff *= .7;
			}
			destColor = vec3(1.) * diff * vec3(spec);
			break; //genShadowでさらにレイマーチループしてるからbreak消すとヤバい
		}
			
	}
	
	gl_FragColor = vec4(destColor * max(.5, shadow), 1.);

}