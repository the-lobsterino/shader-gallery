#extension GL_OES_standard_derivatives : enable

#define PPS 1

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 lightDir = vec3(.5, .5, -.5);

float smoothMin(float d1, float d2, float k){
	float h = exp(-d1 * k) + exp(-d2 * k);
	return -log(h) / k;
}

mat2 rot(float a){
	float s = sin(a), c = cos(a);
	return mat2(c, s, -s, c);
}

float rand(vec2 p){
	return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

float rand(float p){
	return fract(sin(p) * 1248.59432);
}

float sdBox(vec3 p, vec3 b){
	vec3 d = abs(p) - b;
	return length(max(d, 0.)) + min(max(max(d.x, d.y), d.z), 0.);
}

float sdSphere(vec3 p, float r){
	return length(p) - r;
}

float sdFloor(vec3 p, vec3 n, float h){
	return dot(p, n) - h;
}

float map(vec3 p){
	vec3 q = p;
	q.xy *= rot(time);
	q.xz *= rot(time * .9);
	float d1 = sdBox(q, vec3(.7)) - .1;
	float d2 = 1.;
	for(int i = 0; i < 9; i++){
		float x = 1.8 * sin(time + float(i) * .6);
		float y = 1.9 * sin(time * .7 + float(i) * 1.3);
		float z = 1.1 * cos(time * 1.3 + float(i) * 4.6);
		float c = sdSphere(p + vec3(x, y, z), .3 + .9 * rand(float(i)));
		d2 = smoothMin(d2, c, 6.);
	}
	p.z += 1.3;
	p.zy *= rot(.024 * p.z);
	float d3 = sdFloor(p, vec3(0., 1., 0.), -3.);
	return smoothMin(smoothMin(d1, d2, 6.), d3, 6.);
}

vec3 genNormal(vec3 p){
	vec2 d = vec2(0.001, 0.);
	return normalize(vec3(
		map(p + d.xyy) - map(p - d.xyy),
		map(p + d.yxy) - map(p - d.yxy),
		map(p + d.yyx) - map(p - d.yyx)
		));
}

float genShadow(vec3 ro, vec3 rd){
	float c = 0.001;
	float h = 0.;
	float r = 1.;
	float shadowCoef = .5;
	for(int i = 0; i < 40; i++){
		h = map(ro + c * rd);
		if(h < 0.001){
			return shadowCoef;
		}
		if(c > 10.) break;
		r = min(r, h * 16. / c);
		c += h;
	}
	return mix(shadowCoef, 1., r);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy )  / min(resolution.x, resolution.y);

	vec3 color = vec3(0.0);
	//color.xy = p;
	
	vec3 cPos = vec3(0., 0., -4.);
	vec3 ct = vec3(.0);
	vec3 fwd = normalize(ct - cPos);
	vec3 up = vec3(0., 1., 0.);
	vec3 side = normalize(cross(up, fwd));
	up = normalize(cross(fwd, side));
	vec3 rd = normalize(p.x * side + p.y * up + fwd * (1. + .05 * (1. - dot(p, p))));
	
	float d, dd;
	int k;
	
	for(int i = 0; i< 256; i++){
		dd = map(cPos + d * rd);
		if(dd < 0.001){
			//color += 1.;
			break;
		}
		k = i;
		d += dd;
	}
	
	vec3 ip = cPos + d * rd;
	
	// Lighting
	if(dd < 0.001){
		vec3 normal = genNormal(ip);
		
		float diff = clamp(dot(lightDir, normal), 0., 1.);
		float amb = .5 + .5 * dot(normal, vec3(0., 1., 0.));
		float ao = 1. - (float(k) + dd / 0.001)/ 100.;
		
		float shadow = genShadow(ip + normal * 0.01, lightDir);
		
		color += diff * vec3(.8, .7, .5);
		color *= shadow;
		color += amb * vec3(.3, .4, .5);
		//color *= ao;
		
	}
	
	
	// PostProcess
#if PPS == 1	
	// Vignette
	float t = floor(time * 10.);
	p = gl_FragCoord.xy / resolution.xy;
	float vI = 13.0 * (p.x * (1.-p.x) * p.y * (1.0-p.y));
	vI = pow(vI, 2.);
	vI *= mix( 0.9, 1.0, rand(t + 0.5));
	// Add additive flicker
	vI += .6 + 0.06 * rand(t+8.);
	// Add a fixed vignetting (independent of the flicker)
	vI *= pow(16.0 * p.x * (1.0-p.x) * p.y * (1.0-p.y), .2);
	color *= vI;	
	
	// Noise
	color += .06 * (vec3(rand(fract(p * time))) - .5);
	
	// Gamma correction
	color = sqrt(color);
#endif
	gl_FragColor = vec4( color, 1.0 );

}