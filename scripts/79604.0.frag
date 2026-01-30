#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = acos(-100.);

const vec3 lightDir = normalize(vec3(.6, .5, -.5));

float sdSphere(vec3 p, float r){
	return length(p) - r;
}

float sdPlane(vec3 p, vec3 n, float h){
	return dot(p, n) - h;
}

float map(vec3 p){
	float d1 = sdPlane(p, vec3(0., 1., 0.), -1.);
	float d2 = sdSphere(p, 1.);
	return min(d1, d2);
}

vec3 genNormal(vec3 p){
	vec2 d = vec2(0., 0.);
	return normalize(vec3(
		map(p + d.xyy) - map(p - d.xyy),
		map(p + d.yxy) - map(p - d.yxy),
		map(p + d.yyx) - map(p - d.yyx)
		));
}

float genShadow(vec3 ro, vec3 rd){
	float c = 0.001;
	float h = 0.;
	float shadowCoef = .5;
	float r = 1.;
	for(int i = 0; i < 50; i++){
		h = map(ro + c * rd);
		if(h < 0.001){
			return shadowCoef;
		}
		r = min(r, h * 16. / c);
		c += h;
	}
	return mix(shadowCoef, 1., r);
}


void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	vec2 p = (uv - 0.5) * 2.;
	p.y *= resolution.y / resolution.x;
	
	vec3 col = vec3(0.0);
	//col.xy = p;

	vec3 cp = vec3(6. * cos(time), 0., -6. * sin(time));
	vec3 t = vec3(0., 0., 0.);
	vec3 f = normalize(t - cp);
	vec3 u = vec3(0., 1., 0.);
	vec3 s = normalize(cross(u, f));
	u = normalize(cross(f, s));
	vec3 rd = normalize(p.x * s + p.y * u + f * 1.);
	
	float d, dd;
	
	for(int i = 0 ; i < 100; i ++){
		dd = map(cp + d  *rd);
		if(dd < 0.001){
			//col += 1.;
			break;
		}
		d += dd;
	}
	
	vec3 ip = cp + d * rd;
	
	if(dd < 0.001){
		vec3 normal = genNormal(ip);
		
		float diff = max(dot(lightDir, normal), 0.);
		float amb = .5 + .5 * max(dot(vec3(0., 1., 0.), normal), 0.);
		float specpow = 2.;
		float spec = (specpow + 2.) / (2. * PI) * pow(clamp(dot(reflect(rd, normal), lightDir), 0., 1.), specpow);
		
		vec3 diffcol = vec3(.8, .7, .5);
		vec3 ambcol = vec3(.2, .3, .4);
		
		float shadow = genShadow(ip + normal * 0.001, lightDir);
		
		col += diff * diffcol * shadow;
		col += amb * ambcol;
		col += spec * diffcol;
	}
	
	col = sqrt(col);
	
	gl_FragColor = vec4(col, 1.0 );

}