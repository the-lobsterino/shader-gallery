/// CHATGPT, show me 


#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

float orgy(vec2 p) {
	float pl=0., expsmo=0.;
	float t=sin(time*8.);
	float a=-.35+t*.02;
	p*=mat2(cos(a),sin(a),-sin(a),cos(a));
	p=p*.07+vec2(.728,-.565)+t*.017+vec2(0.,t*.014);
	for (int i=0; i<10; i++) {
		p.x=abs(p.x);
		p=p*2.+vec2(-2.,.85)-t*.04;
		p/=min(dot(p,p),1.06);  
		float l=length(p*p);
		expsmo+=exp(-1.2/abs(l-pl));
		pl=l;
	}
	return expsmo*1.4;
}


void main( void )
{
	vec2 uv = gl_FragCoord.xy/resolution.xy-.5;
  	uv.x*=resolution.x/resolution.y;
	vec2 p=uv; p.x*=1.2;
	p.y += 0.035;
	float o=clamp(orgy(p)*.07,.20,1.); o=pow(o,1.8);
	vec3 col=vec3(o*.88,o*o*.97,o*o*o*1.2);
	float hole=length(uv+vec2(.1,0.05))-.25;
		col*=pow(abs(1.-max(0.,hole)),8.);
	col = pow(col,vec3(0.7));
	gl_FragColor = vec4(col, 1.0 );
}
