#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 lightDir = normalize(vec3(.25, .5, -.5));

mat2 rot(float a){
	float s = sin(a), c = cos(a);
	return mat2(c, s, -s, c);
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
	//return sdBox(p, vec3(1.));
	
	vec3 q = p;
	q.xz *= rot(time);
	
	float d1 = 1.;
	float size = .5;
	
	for(int i = 0; i < 3; i++){
		for(int j = 0; j < 3; j++){
			for(int k = 0; k < 3; k++){
				vec3 offset = vec3(float(i), float(j), float(k)) - 1.;
				d1 = min(d1, sdBox(q - offset * (1.5 + sin(time) * .5) * size, vec3(.5 * size)));
			}
		}
	}
	
	p.yz *= rot(-p.z * .02);
	float d2 = sdFloor(p, vec3(0., 1., 0.), -3.);
	
	return min(d1, d2);
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
		h = map(ro + rd * c);
		if(h < 0.001){
			return shadowCoef;
		}
		r = min(r, h * 16. / c);
		c += h;
	}
	return mix(shadowCoef, 1., r);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy )/ min(resolution.x, resolution.y);

	vec3 color = vec3(0.0);
	//color.xy = p;
	
	vec3 cPos = vec3(0., 2., -3.);
	vec3 t = vec3(0., 0., 0.);
	vec3 fwd = normalize(t - cPos);
	vec3 up = normalize(vec3 (0., 1., 0.));
	vec3 side = normalize(cross(up, fwd));
	up = normalize(cross(fwd, side));
	vec3 rd = normalize(p.x * side + p.y * up + fwd);
	
	float d, dd;
	
	for(int i = 0; i < 100; i++){
		dd = map(cPos + d * rd);
		if(dd < 0.001){
			//color += 1.;
			break;
		}
		d += dd;
	}
	
	vec3 ip = cPos + d * rd;
	
	if(dd < 0.001){
		vec3 normal = genNormal(ip);
		
		float diff = clamp(dot(normal, lightDir), 0., 1.);
		float amb = .5;
		
		float shadow = genShadow(ip + normal * 0.01, lightDir);
		
		vec3 diffCol = vec3(.8, .7, .4);
		vec3 ambCol = vec3(.3, .4, .5);
		
		color += diff * diffCol * shadow + amb * ambCol;
	}
	
	color = sqrt(color);
		
	gl_FragColor = vec4( color, 1.0 );

}