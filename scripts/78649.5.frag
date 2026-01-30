#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 minvec2(vec2 a, vec2 b){
	return a.x < b.x ? a : b;
}

vec3 hsv(float h, float s, float v){
	return ((clamp(abs(fract(h+vec3(0,2,1)/3.)*6.-3.)-1.,0.,1.)-1.)*s+1.)*v;
}

float sdFloor(vec3 p, vec3 n, float h){
	return dot(p, n) - h;
}

float sdBox(vec3 p, vec3 b){
	vec3 d = abs(p) - b;
	return length(max(d, 0.)) + min(max(max(d.x, d.y), d.z), 0.);
}

float sdSphere(vec3 p, float r){
	return length(p) - r;
}

mat2 rot(float a){
	float s = sin(a), c = cos(a);
	return mat2(c, s, -s, c);
}
float PI = acos(-1.);

vec2 pmod(vec2 p, float r){
	float a = atan(p.x, p.y) + PI / r;
	float n = 2. * PI / r;
	a = floor(a / n) * n;
	return p * rot(-a);
}

vec2 map(vec3 p){	
	
	vec2 d1 = vec2(sdSphere(p, 1.), 1.);
	vec2 d2 = vec2(sdFloor(p, vec3(0., 1., 0.), -1.), 0.);
	d2 = vec2(sdBox(p + vec3(0., 2., 0.), vec3(3., 1., 3.)), 0.);
	
	p.xz *= rot(time * .6);
	
	float div = 5.;	
	float a = atan(p.x, p.z) + PI / div;
	float n = 2. * PI / div;
	a = floor(a / n);
	p.xz = pmod(p.xz, div);
	
	vec2 d3 = vec2(sdSphere(p + vec3(0.,-.3 + 1. - abs(sin(time - PI * a / div)), -2.), .3), 2. + 1. / div * a);
	return minvec2(minvec2(d1, d2), d3);
}

vec3 genNormal(vec3 p){
	vec2 d = vec2(0.001, 0.);
	return normalize(vec3(
		map(p + d.xyy).x - map(p - d.xyy).x,
		map(p + d.yxy).x - map(p - d.yxy).x,
		map(p + d.yyx).x - map(p - d.yyx).x
		));
}

float genShadow(vec3 ro, vec3 rd){
	float h = 0.0;
	float c = 0.001;
	float r = 1.;
	float shadowCoef = 0.5;
	for(int i = 0; i < 50; i++){
		h = map(ro + c * rd).x;
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

	vec3 cPos = vec3(sin(time * .4) * 3., sin(time * .3) + .5, cos(time * .4) * 3.);
	vec3 t = vec3(0.);
	vec3 fwd = normalize(t - cPos);
	vec3 up = vec3(0., 1., 0.);
	vec3 side = normalize(cross(up, fwd));
	up = normalize(cross(fwd, side));
	vec3 rd = normalize(p.x * side + p.y * up + fwd * (1. + .3 * (1. - dot(p, p))));
	
	float d = 0.001;
	vec2 dd = vec2(0., 0.);
	
	int k;
	
	for(int i = 0; i < 100; i++){
		dd = map(cPos + d * rd);
		if(dd.x < 0.001){
			//color += 1.;
			break;
		}
		d += min(dd.x, 0.3);
		k = i;
	}
	
	vec3 col1 = vec3(0.2);
	float ref1 = .5;
	vec3 col2 = vec3(.7, .7, .7);
	float ref2 = .1;
	vec3 col3 = hsv(fract(dd.y), .7, .7);
	float ref3 = .2;
	
	vec3 ip = cPos + d * rd;
	vec3 lightDir = normalize(vec3(.5, .4, -.4 ));
	vec3 lightCol = vec3(1.2);
	if(dd.x < 0.001){
		vec3 albedo = vec3(0.);
		float ref = 0.;
		if(dd.y == 1.){
			albedo = col1;
			ref = ref1;
		}else if(dd.y == 0.){
			albedo = col2;
			ref = ref2;			
		}else{
			albedo = col3;
			ref = ref3;
		}
		vec3 normal = genNormal(ip);
		
		float diff = clamp(dot(lightDir, normal), 0.1, 1.);
		float spec = pow(clamp(dot(reflect(lightDir, normal), rd), .0, 1.), 22.);
		
		float ao = float(k) / 300.;
		
		float shadow = genShadow(ip + normal * 0.01, lightDir);
		
		color += diff * albedo * lightCol;
		color += spec;
		color += ao;
		
		
		//mirror
		vec3 ro = ip;
		vec3 rd = reflect(rd, normal);
		d = 0.001;
		for(int i = 0; i < 50; i++){
			dd = map(ro + d * rd);
			if(dd.x < 0.001){
				//color += 1.;
				break;
			}
			d += min(dd.x, 0.3);
			//d += dd.x;
			k = i;
		}
		vec3 col_ref;
		if(dd.x < 0.001){
			if(dd.y == 1.){
				albedo = col1;
			}else if(dd.y == 0.){
				albedo = col2;			
			}else{
				albedo = col3;
			}
			ip = ro + d * rd;
			normal = genNormal(ip);
			
			diff = clamp(dot(lightDir, normal), 0.1, 1.);
			spec = pow(clamp(dot(reflect(lightDir, normal), rd), .0, 1.), 22.);
			
			col_ref += diff * albedo * lightCol + spec;
			//col2 *= shadow;
		}else{
			col_ref += mix(vec3(1.), vec3(0.5, 0.8, 0.9), clamp(p.y, 0., 1.));
		}
		color += col_ref * ref;
		
		color *= shadow;
		
	}else{
		color += mix(vec3(1.), vec3(0.5, 0.8, 0.9), clamp(p.y, 0., 1.));
	}
		
	gl_FragColor = vec4(color, 1.0 );

}