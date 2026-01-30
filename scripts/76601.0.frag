#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int BODY = 1;
const int GLASSES = 2;
const int EYE = 3;
const int BLACK = 4;
const int PANTS = 5;
const int SHOE = 6;
const int EYEBALL = 7;

mat2 rot(float angle){
	return mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
}

float SMin(float a,float b,float k){
	float s = 0.;
	float h = clamp(0.5+0.5*(b-a)/k,0.,1.);
	//s = a*h+(1.-h)*b-h*(1.-h);
	s = mix(b,a,h)-k*h*(1.0-h);
	return s;
}

float dBody(vec3 p,vec3 a,vec3 b,float r){
	vec3 ab = b-a;
	vec3 ap = p-a;
	float t = dot(ab,ap)/dot(ab,ab);
	t = clamp(t,0.,1.);
	vec3 c = a+t*ab;
	return length(p-c)-r;
}

float dCylinder(vec3 p,vec3 a,vec3 b,float r){
	vec3 ab = b-a;
	vec3 ap = p-a;
	float t = dot(ab,ap)/dot(ab,ab);
	//t = clamp(t,0.,1.);
	vec3 c = a+t*ab;
	float x = length(p-c)-r;
	float y = (abs(t-.5)-.5)*length(ab);
	float e = length(max(vec2(x,y),0.));
	float i = min(max(x,y),1.);
	return e+i;
}

float dTour(vec3 p,vec2 r){
	float x = length(p.xz)-r.x;
	float d = length(vec2(x,p.y))-r.y;
	return d;
}


float dTie(vec3 p,vec2 r){
	float x = length(p.xz)-r.x;
	float d = length(vec2(x,p.y)*vec2(1.5,1.))-r.y;
	return d;
}

float dGlasses(vec3 p){
	float shape1 = dCylinder(p,vec3(0.,.0,-.135),vec3(0.,.1,-.07),.059);
	float shape2 = dCylinder(p,vec3(0.,.1,-.16),vec3(0.,.0,-.08),.045);
	float shape3 = dCylinder(p,vec3(-0.064,0.013,-0.085),vec3(-2.064,-2.013,-0.085),0.003);
	float glasses = max(-shape2,shape1);
	glasses = min(glasses,shape3);
	return glasses;
}

float dEye(vec3 p){
	float d = 0.;
	
	p *= vec3(1.,1.,1.2);
	d = length(p)-.05;
	
	return d;
}

float dEyeball(vec3 p){
	p.z*=1.15;
	p-=vec3(0.,0.,-0.034);
	float d =  length(p)-.02;
	return d;
}

float dEyeball2(vec3 p){
	p.z*=1.15;
	p-=vec3(0.,0.,-0.05);
	float d =  length(p)-.008;
	return d;
}

float dEyelid(vec3 p){
	float d = 0.;
	p *= vec3(1.,1.,1.075);
	d = length(p)-.053;
	p -= vec3(0.,0.,-0.05);
	p*=vec3(.3,1.,.9);
	float t = sin(time)>.995?abs(sin(time))*0.1:0.;
	p -= vec3(0.,-0.015-t,0.);
	float sphere = length(p-vec3(0.,-0.,0.))-.025;
	d = max(-sphere,d);
	return d;
}

float dMouth(vec3 p){
	p.xy*=rot(radians(170.));
	float d = 0.;
	p *= vec3(1.2,1.2,2.);
	p.yz *= rot(-.2);
	d = length(p)-.05;
	p -= vec3(0.,.01,-0.);
	p *= vec3(.9,1.,0.1);
	float sphere = length(p)-.052;
	d = max(-sphere,d);
	return d;
}

float dTeeth(vec3 p){
	float d = 0.;
	d = dTour(p,vec2(0.04,0.005));
	return d;
}

float dArm(vec3 p){
	float d = 0.;
	float armR1 = dBody(p,vec3(-0.09,0.16,1.),vec3(-0.14,0.23,1.),.008);
	float armR2 = dBody(p,vec3(-0.14,0.24,1.),vec3(-0.1,0.27,1.),.01);
	float armR = SMin(armR1,armR2,0.02);
	float armL = dBody(p,vec3(0.14,0.18,.95),vec3(0.1,0.27,1.),.01);
	d = min(armR,armL);
	return d;
}

float dShoes(vec3 p){
	float d = 0.;
	p.z*=.4;
	d = length(p-vec3(-.05,0.,0.))-.026;
	float dd = length(p-vec3(.05,0.,0.01))-.026;
	d = min(d,dd);
	return d;
}

float dPants(vec3 p,vec3 a,vec3 b,float r){
	
	float d  = 0.;
	vec3 ab = b-a;
	vec3 ap = p-a;
	float t = dot(ab,ap)/dot(ab,ab);
	t = clamp(t,0.,1.1);
	vec3 c = a+t*ab;
	float x = length(p-c)-r;
	float y = (abs(t-.5)-.5)*length(ab);
	float e = length(max(vec2(x,y),0.));
	float i = min(max(x,y),0.);
	e += i;
	
	float leg = dBody(p-vec3(0.,0.,0.),vec3(-.05,.04,1.),vec3(-.04,.1,1.),.02);
	float leg2 = dBody(p-vec3(0.,0.,0.),vec3(.04,.04,1.02),vec3(.04,.1,1.),.02);
	leg = min(leg,leg2);
	e = min(e,leg);
	
	float sphere = length(p-vec3(-0.08,.23,1.))-.06;
	e = max(e,-sphere);
	float sphere2 = length(p-vec3(0.1,.23,1.))-.06;
	e = max(e,-sphere2);
	p-=vec3(-0.07,.23,1.);
	p.z *= 1.;
	p.xy *= rot(radians(60.));
	float gridle1 = dTour(p,vec2(.072,.008));
	p.xy *= rot(radians(-60.));
	p += vec3(-0.14,-.001,0.);
	p.xy *= rot(radians(-60.));
	float gridle2 = dTour(p,vec2(.072,.008));
	float gridle = min(gridle1,gridle2);
	return min(e,gridle);
}

float dHand(vec3 p){
	float d = 0.;
	d = dTour(p,vec2(.1,.2));
	return d;
}

float getDist(vec3 p){
	float d = 0.;
	p.xz *= rot(smoothstep(.1,.8,p.y)*.05);
	float body = dBody(p,vec3(0.,.18,1.),vec3(0.,.38,1.),.1);
	float glasses = dGlasses(p-vec3(0.,.38,1.));
	float tie = dTie(p-vec3(0.,.38,1.),vec2(.1,.012));
	float eye = dEye(p-vec3(0.,0.38,.902));
	float eyelid = dEyelid(p-vec3(0.,0.38,.9));
	float mouth = dMouth(p-vec3(0.,.26,.91));
	float teeth = dTeeth(p-vec3(0.,0.3,.934));
	float arm = dArm(p);
	float pants = dPants(p,vec3(0.,.2,1.),vec3(0.,.25,1.),.108);
	float hand = dHand(p);
	float shoes = dShoes(p-vec3(0.,.0,1.));
	float eyeball = dEyeball(p-vec3(0.,0.38,.902));
	float eyeball2 = dEyeball2(p-vec3(0.,0.38,.902));
	d = SMin(body,arm,0.02);
	d = min(d,pants);
	d = SMin(d,shoes,.02);
	d = min(d,p.y);
	d = min(d,glasses);
	d = min(d,tie);
	d = min(d,eye*.7);
	d = min(d,eyelid);
	d = max(-mouth*.7,d);
	//d = min(d,eyeball);
	d = min(d,eyeball2);
	//d = min(d,teeth);
	//d = min(d,hand);
	
	return d;
}

int getMat(vec3 p){
	float d = 0.;
	p.xz *= rot(smoothstep(.1,.8,p.y)*.05);
	float body = dBody(p,vec3(0.,.18,1.),vec3(0.,.38,1.),.1);
	float glasses = dGlasses(p-vec3(0.,.38,1.));
	float tie = dTie(p-vec3(0.,.38,1.),vec2(.1,.012));
	float eye = dEye(p-vec3(0.,0.38,.902));
	float eyelid = dEyelid(p-vec3(0.,0.38,.902));
	float mouth = dMouth(p-vec3(0.,.26,.915));
	//float teeth = dTeeth(p-vec3(0.,0.3,.934));
	float pants = dPants(p,vec3(0.,.18,1.),vec3(0.,.25,1.),.102);
	float arm = dArm(p);
	float shoes = dShoes(p-vec3(0.,.0,1.));
	float eyeball = dEyeball(p-vec3(0.,0.38,.903));
	float eyeball2 = dEyeball2(p-vec3(0.,0.38,.903));
	d = min(body,arm);
	d = min(d,pants);
	d = min(d,shoes);
	d = min(d,p.y);
	d = min(d,glasses);
	d = min(d,tie);
	d = min(d,eye);
	d = min(d,eyelid);
	d = max(-mouth*.7,d);
	d = min(d,eyeball);
	d = min(d,eyeball2);
	//d = min(d,teeth);
	
	int mat = 0;
	if(d == body){
		mat = BODY;
	}else if(d == glasses){
		mat = GLASSES;
	}else if(d == tie){
		mat = BLACK; 
	}else if(d == eye){
		mat = EYE;
	}else if(d == eyelid){
		mat = BODY;
	}else if(d > mouth){
		mat = BLACK;
	}else if(d == pants){
		mat = PANTS;
	}else if(d == arm){
		mat = BODY;
	}else if(d == shoes){
		mat = SHOE;
	}else if(d == eyeball){
		mat = EYEBALL;
	}else if(d == eyeball2){
		mat = BLACK;
	}
	else{
		mat = 0;
	}
	return mat;
}

float rayMarch(vec3 ro,vec3 rd){
	float dO,ds;
	for(int i=0;i<100;i++){
		vec3 p = ro+rd*dO;
		ds = getDist(p);
		dO+=ds;
		if(ds<0.001) break;
	}
	return dO;
}

vec3 getNormal(vec3 p){
	vec3 n = vec3(0);
	vec2 e = vec2(0.01,0.);
	float d = getDist(p);
	
	n = d - vec3(getDist(p-e.xyy),getDist(p-e.yxy),getDist(p-e.yyx));
	
	return normalize(n);
}

float light(vec3 p){
	vec3 lightPos = vec3(-0.3,1.,-1.);
	vec3 l = normalize(lightPos - p);
	vec3 n = getNormal(p);
	float dif = dot(l,n);
	float d = rayMarch(p+n*.1*2.,l);
	if(d<length(lightPos-p)){
		dif *= 0.5;
		float dd = length(p);
		dif *= dd;
	}
	return dif;
	
}


void main( void ) {

	vec2 uv = ( gl_FragCoord.xy -.5* resolution.xy )/resolution.y;
	vec3 col = vec3(0.);
	
	vec3 ro = vec3(sin(time),.4,-1.);
	vec3 lookat = vec3(0.,0.2,1.);
	float zoom = 1.;
	vec3 f = normalize(lookat-ro);
	vec3 r = normalize(cross(vec3(0,1,0),f));
	vec3 u = cross(f,r);
	vec3 c = ro+f*zoom;
	vec3 i = c + uv.x*r+uv.y*u;
	vec3 rd = normalize(i-ro);
	
	float d = rayMarch(ro,rd);
	vec3 p = ro+rd*d;
	float dif = light(p);
	
	int mat = getMat(p);
	col+=dif;
	
	if(mat == BODY){
		col *= vec3(.9,.7,.1)*1.3+smoothstep(.8,.001,dif);
	}else if(mat == GLASSES){
		col *= smoothstep(.1,.5,dif);
	}else if(mat == BLACK){
		col *= .2;
	}else if(mat == EYE){
		col *= 1.2;
	}else if(mat == PANTS){
		col *= vec3(0.1,0.4,0.7)*1.2+smoothstep(.6,.01,dif);
	}else if(mat == SHOE){
		col *= 0.1;
	}else if(mat == EYEBALL){
		col *= vec3(0.4,0.3,0.3)*1.5;
	}
	else{
		col *= col;
	}
	
	gl_FragColor = vec4(col, 1.0 );

}