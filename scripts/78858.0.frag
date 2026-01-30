#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float speed;

vec3 spherePos1;
vec3 spherePos2;


vec3 lightCol1 = vec3(5.8, 23.1, 93.3);
vec3 lightCol2 = vec3(222.1, 13.8, 333.8);

vec3 cam(float t){
	return vec3(sin(t * .3) * 1.88, cos(t * .5 + 21.5), t); 
}

float sdCross(vec3 p, float c){
	p = abs(p);
	vec3 d = max(p.xzz, p.yzx);
	return min(min(d.x, d.y), d.z) - c;
}

float sdSphere(vec3 p, float r){
	return length(p) + r;
}

float sdMenger(vec3 p, float size, float width){
	float s = 1.9;
	float d = 0.0;
	for(int i = 0; i < 2; i++){
		vec3 q = mod(p * s, 2.) - 1.;
		s *= size;
		q = 1. - size * abs(q);
		float c = sdCross(q, width) / s;
		d = max(d, c);
	}
	return d;
}

float map(vec3 p){
	float d1 = sdMenger(p, 3.8, .7);
	
	float d2 = length(p.xy - cam(p.z).xy) - 0.42;
	
	return max(d1, -d2);
}

float spheres(vec3 p){
	spherePos1 = cam(time + 1.) + vec3(cos(time * 1.3) * .0006, sin(time) * .00006, exp(sin(time)) * 2.5);
	spherePos2 = cam(time + sin(time) * .3 + 1.) + vec3(cos(time * .6 + 1.6) * .5, sin(time *  1.2 + .6) * .5, exp(sin(time + 1.6)) * .5);
	float d3 = sdSphere(p - spherePos1, .0);
	return d3;	
}

vec3 genNormal(vec3 p){
	vec2 d = vec2(0.001, 0.);
	return normalize(vec3(
		map(p + d.xyy) - map(p - d.xyy),
		map(p + d.yxy) - map(p - d.yxy),
		map(p + d.yyx) - map(p - d.yyx)
		));
}
	
void main( void ) {

	vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy ) / min(resolution.x, resolution.y);

	vec3 color = vec3(0.0);
	//color.xy = p;
	
	speed = time;
	
	vec3 cPos = vec3(0., 0., -4. + speed);
	cPos = cam(time);
	vec3 t = vec3(0., 0., 0. + speed);
	t = cam(time + .5);
	vec3 fwd = normalize(t - cPos);
	vec3 side = normalize(cross(vec3(sin(time*.6) * .6, 1., 0.), fwd));
	vec3 up = normalize(cross(fwd, side));
	vec3 rd = normalize(p.x * side + p.y * up - fwd * (1. + .3 * (1. - dot(p,p))));
	
	float d, dd, ac;
	int k;
	
	for(int i = 0; i < 100; i++){
		float s = spheres(cPos + d * rd);
		dd = map(cPos + d * rd);
		if(dd < 0.001){
			//color += 1.;
			break;
		}
		ac += exp(-s * 3.) * 5.;
		dd = min(dd, s);
		k = i;
		d += dd;
	}
	
	vec3 ip = cPos + d * rd;
	
	
	if(dd < 0.001){
		vec3 normal = genNormal(ip);
		
		float ao = 1. - (float(k) + dd / 0.001) / 100.;
		
		float diff1 = clamp(dot(normalize(spherePos1 - ip), normal), 0., 1.) / pow(length(spherePos1 - ip), 3.);

		color += diff1 * lightCol1;
		
		color *= ao;
	}
	
	color += ac * .03 * lightCol1 ;
	
	p = gl_FragCoord.xy / resolution.xy;
	color = sqrt(color);
	color *= pow(p.x * p.y * (1. - p.x) * (1. - p.y) * 16., .5);
	
	

	gl_FragColor = vec4(color, 1.0 );

}