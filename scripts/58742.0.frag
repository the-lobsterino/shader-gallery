// BREXIT

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

float orgy(vec2 p) {
	float pl=1., expsmo=0.;
	float t=sin(time*20.);
	float a=-.35+t*.02;
	p*=mat2(cos(a),sin(a),-sin(a),cos(a));
	p=p*.07+vec2(.718,-.565)+t*.017+vec2(0.,t*.014);
	for (int i=0; i<13; i++) {
		p.x=abs(p.x);
		p=p*2.+vec2(-2.,.85)-t*.04;
		p/=min(dot(p,p),1.03);  
		float l=length(p*p);
		expsmo+=exp(-1.2/abs(l-pl));
		pl=l;
	}
	return expsmo;
}

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

void main( void )
{
	vec2 uv = gl_FragCoord.xy/resolution.xy-.5;
  	uv.x*=resolution.x/resolution.y;
	vec2 p=uv; p.x*=1.2; p*=1.1;
	p.y+=.2; p.x += .1;
	float o=clamp(orgy(p)*.07,.13,1.); o=pow(o,1.8);
	vec3 c1=vec3(o*.8,o*o*.87,o*o*o*.9);
	c1 *=1.6;
	
	float t = time;
	uv*=2.0;
	vec3 c2 = (c1)+vec3(0.1,0.2,0.9);
	uv *= sin(t+uv.y*2.0)+4.0;
	uv.x += 2.5;
	float d = B(uv,1.0);uv.x -= 1.1;
	d = R(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 1.1;
	d = X(uv,d);uv.x -= 1.1;
	d = I(uv,d);uv.x -= 1.1;
	d = T(uv,d);
	d = smoothstep(0.0,0.15,d-0.15*CHS);
	gl_FragColor = vec4(mix(c2, c1, d),1.0);	
}
