// BREXIT TATS BRA

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
#define PI2 6.28308

#define CHS 0.2
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));}
float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);}
float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);}
float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));}
float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);}

float GetText(vec2 uv) {
	float d = B(uv,1.0);uv.x -= 1.1;
	d = R(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 1.1;
	d = X(uv,d);uv.x -= 1.1;
	d = I(uv,d);uv.x -= 1.1;
	d = T(uv,d);
	return smoothstep(0.0,.55,d-0.05*CHS);
}

float orgy(vec2 p) {
	float pl=1., expsmo=0.;
	float t=cos(PI2*pow(mod(time*1.,1.),3.))*.04;
	float a=-.35+t/2.;
	p = p*mat2(cos(a),sin(a),-sin(a),cos(a))*.052 + vec2(.718+t*.425,-.565+t*.775);
	for (int i=0; i<20; i++) {
		p*=min(GetText(vec2(p.y/2.-1.1,p.x/2.+.14)), GetText(vec2(p.x/2.-4.8,p.y/2.-.14)));
		p.x=abs(p.x);
		p=p*2.+vec2(-2.,.85)-t;
		p/=min(dot(p,p),1.03);  
		float l=length(p*p);
		expsmo+=exp(-1.2/abs(l-pl));
		pl=l;
	}
	return expsmo;
}

void main( void )
{
	vec2 uv = gl_FragCoord.xy/resolution.xy-.5;
	uv = uv*vec2(1.32*resolution.x/resolution.y,1.1) +vec2(.1,.2);
		
	float o=pow( clamp(orgy(uv)*.07,.13,1.), 2.)*1.4; 	
	gl_FragColor = vec4(o,.8*o*o,.5*o*o,1.);	
}
