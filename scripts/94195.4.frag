#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform vec2 resolution;
uniform float time;

const float pi = 3.14159265358979;
const float tau = pi*2.;
const float invpi = 1./pi;

float hash(vec2 p){
	return fract(cos(p.x+p.y*332.)*335.552);
}

float voro(vec2 p){
	float s = 1.;
	for(int i=0; i<2; i++) for(int j=0; j<2; j++){
		vec2 c = vec2(j,i);
		s = min(s,length(c+sin(hash(floor(p)+c)*tau)*invpi-fract(p)));
		
	}
	return s;
}

float fbm(vec2 p, float d){
	float v = 0.;
	float l = 1.;
	p = (p*6.)+(time*.01);
	for(int i=0; i<3; i++){
		v += voro(p)*d/l;
		l *= 2.9;
		p = (p*3.8)+(time*.2);
	}
	return smoothstep(1.,.2,v);
}

vec3 clov(vec3 bc, vec3 p){
	vec3 sc = vec3(0.);
	vec3 cc = vec3(1.);
	vec3 shc = bc;
	vec2 cp = (p.xz/p.y)*.2;
	float d = 2.;
	for(int i=0; i<10; i++){
		float cm = fbm(cp,d);
		d *= 0.95;
		cp *= 0.95;
		if(i>=3) cc *= (shc * 0.1 + 0.87);
		bc = mix(bc,cc,cm*.7*smoothstep(0.1,0.5,p.y));
	}
	return bc;
}

void main(void){
	vec2 uv = gl_FragCoord.xy / resolution;
		uv.y += 0.2;
	vec3 vp = normalize(vec3(uv*2.-1.,-1.));
	
	vec3 b = mix(vec3(1.),vec3(.1,.4,1),1.-exp(-clamp(vp.y,0.,1.)*1.5));
		b = clov(b, vp);
	gl_FragColor = vec4(b,1);
}
