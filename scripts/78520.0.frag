#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = acos(-1.);

vec3 lightDir = normalize(vec3(0.5 * cos(time), .5, .5 * sin(time)));

float sdSphere(vec3 p, float r){
	return length(p) - r;
}

float sdFloor(vec3 p, vec3 n, float h){
	return dot(p, n) - h;
}

vec2 compare(vec2 a, vec2 b){
	return (a.x < b.x) ? a : b;
}

vec2 map(vec3 p){
	vec2 d1 = vec2(sdSphere(p - vec3(1.3, 0., 0.), 1.), 1.);
	vec2 d2 = vec2(sdSphere(p - vec3(-.25, -0.5, 0.), .5), 2.);
	vec2 d3 = vec2(sdFloor(p, vec3(0., 1., 0.), -1.), 0.);
	return compare(compare(d1, d2), d3);
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
	float h = 0.001;
	float c = 0.;
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

	vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy ) / min(resolution.x, resolution.y);

	vec3 color = vec3(0.0);
	//color.xy = p;
	
	vec3 cPos = vec3(0., 0., -3.);
	vec3 rd = normalize(vec3(p, 1.));
	
	vec2 d, dd;
	int k;
	
	for(int i = 0; i < 500; i ++ ){
		dd = map(cPos + d.x * rd);
		if(dd.x < 0.001){
			break;
		}
		k = i;
		d.x += dd.x;
	}
	
	if(dd.x < 0.001){
		vec3 ip = cPos + d.x * rd;
		vec3 normal = genNormal(ip);
		
		float shadow = genShadow(ip + normal * 0.01, lightDir);
		
		vec3 skycolor = vec3(0.4, 0.6, 0.8);
		vec3 bounscolor = vec3(.6, .3, .1);
		vec3 difcolor = vec3(7., 5.8, 3.6);
		
		
		
		vec3 albedo;
		float specPow;
		
		if(dd.y == 0.){
			albedo = vec3(.03, .03, .03);
			specPow = 1.; 
		}else if(dd.y == 1.){
			albedo = vec3(.08, .08, .21);
			specPow = 8.; 
		}else{
			albedo = vec3(.39, .16, .17);
			specPow = 100.; 
		}
		
		float diff = clamp(dot(lightDir, normal), 0., 1.);
		float diff_sky = clamp(0.5 + 0.5 *dot(vec3(0., 1., 0.), normal), 0., 1.);
		float diff_bouns = clamp(0.2 + 0.2 * dot(vec3(0., -1., 0.), normal), 0., 1.);
		float norm_factor = (specPow) / (pi * 2.);
		float spec = norm_factor * pow(clamp(dot(reflect(lightDir, normal), rd), 0., 1.), specPow) / pi;
		
		vec3 light_in = vec3(0.);
		light_in += difcolor * diff * shadow;
		light_in += skycolor * diff_sky;
		light_in += bounscolor * diff_bouns;
		light_in = max(vec3(.2), light_in);
		
		color += light_in* albedo;
		color += spec * albedo * shadow;
	}else{
		color = vec3(0.4, 0.6, 0.8) - .7 * rd.y;
	}
	//color += float(k) / 600. * vec3(0.5, .8, .9);
	
	gl_FragColor = vec4(color, 1.0 );

}