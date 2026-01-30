#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = acos(-1.);

mat2 rot(float a){
	float s = sin(a), c = cos(a);
	return mat2(c, s, -s, c);
}

vec2 pmod(vec2 p, float r){
	float a = atan(p.x, p.y) + PI / r;
	float n = 2. * PI / r;
	a = floor(a / n) * n;
	return p * rot(-a);
}
		

float sdBox(vec3 p, vec3 b){
	vec3 d = abs(p) - b;
	return length(max(d, 0.)) + min(max(max(d.x, d.y), d.z), 0.);
}

float sdSphere(vec3 p, float r){
	return length(p) - r;
}

float map(vec3 p){
	p.xy = pmod(p.xy, 2.);
	p.y -= 2.;
	p.z = mod(p.z, 10.) - 5.;
	p.x = mod(p.x, 7.) - 3.5;
	p.y += sin(time + p.z * 2.);
	for(int i = 0; i < 3; i++){
		p = abs(p) - 1.;
		p.xy *= rot(time * floor(p.z));
	}
	return sdBox(p, vec3(.4, .2, .8));
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy ) / min(resolution.x, resolution.y);

	vec3 color = vec3(0.0);
	//color.xy = p;
	
	vec3 cPos = vec3(0., 0., -8. + time * 5.);
	vec3 rd = normalize(vec3(p,1.));
	
	float d, dd;
	float ac;
	
	for(int i = 0; i < 100; i++){
		dd = map(cPos + d * rd);
		/*
		if(dd < 0.001){
			color += 1.;
			break;
		}
		*/
		dd = max(abs(dd), 0.001);
		ac += exp(-dd * 3.);
		d += dd;
	}
	
	color += ac * 0.005;
	
	color = sqrt(color);

	gl_FragColor = vec4(color, 1.0 );

}