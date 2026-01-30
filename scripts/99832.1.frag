#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 lightDir = normalize(vec3(.5, .5, -.5));

vec3 palette(float d){
	return mix(vec3(.2, .7, .9), vec3(1., .0, 1.), d);
}

mat2 rot(float a){
	float s = sin(a), c = cos(a);
	return mat2(c, s, -s, c);
}

float sdSphere(vec3 p, float r){
	return length(p) - r;
}

float sdBox(vec3 p, vec3 b){
	p = abs(p) - b;
	return min(max(max(p.x, p.y), p.z), 0.) + length(max(p, 0.));
}

float map(vec3 p){
	vec3 q = p;
	q.x = abs(q.x) - 8.;
	q.z = mod(q.z, 12.) - 6.;
	for(int i = 0;i < 6; i++){
		q.xy *= rot(time * .3);
		q.xz *= rot(time * .6);
		q.xy = abs(q.xy) - 1.;	
		q.xz = abs(q.xz) - .3;	
	}
	return sdBox(q, vec3(1., .3, .2 ));
	return sdSphere(p, 1.);
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

	vec3 col = vec3(0.);
	//col.xy = p;	

	vec3 cPos = vec3(0., 0., -8. + time * 10.);
	vec3 rd = normalize(vec3(p, 1.));
	
	float d, dd;
	float ac = 0.;
	int j = 0;
	
	cPos += rd * 3.;
	
	for(int i = 0;i < 100; i++){
		dd = map(cPos + d * rd) * .5;
		if(dd < 0.001){
			//col += 1.;
			//break;
		}
		ac += exp(-d * .3);
		j = i;
		d += dd;
	}
	col += ac * vec3(.2, 1., 1.3) * .01;
	//col += exp(1. - d);
	vec3 ip = cPos + d * rd;
	
	if(dd < 0.001){
		vec3 normal = genNormal(ip + 0.001);
		// col += abs(normal);
		
		float edge = clamp(pow(length(normal - genNormal(ip - 0.03)) * 55., 55.), 0.,1.);
		
		float diff = clamp(dot(normal, lightDir), 0., 1.);
		vec3 diffCol = vec3(.8, .7, .5);
		
		//col += diff * diffCol + vec3(.2, .3, .4);
	}
			
	col = pow(col, vec3(0.4545));
	gl_FragColor = vec4( col, 1.0 );

}