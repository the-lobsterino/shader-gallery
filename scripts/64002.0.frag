#ifdef GL_ES
precision mediump float;
#endif

// dashxdr was here
// 20200403

uniform vec2 resolution;

vec2 hash2( vec2 p )
{
	p = vec2( dot(p,vec2(63.31,127.63)), dot(p,vec2(395.467,213.799)) );
	return -1.0 + 2.0*fract(sin(p)*43141.59265);
}

void main(void) {//Image( out vec4 fragColor, in vec2 fragCoord )
	vec2 uv = 3.*((gl_FragCoord.xy-0.5*resolution.xy)/resolution.x);
	float a=0.;
	vec2 h = vec2(1., 0.0);
	bool d=false;
	for(int i=0; i<100; i++){
		float s=sign(h.y);//s=1.;
		h = hash2(h);
		vec2 v=vec2(-uv.x+h.x, -uv.y+h.y);
		if(length(v)<.015) d=true;
		float t=atan(v.y, v.x)/3.1415927;
		a += s*t;
	}

	float l = length(uv)*15. + a;
	
	float m = mod(l,2.);
	float s=.3;
	float p=.8;
	float v = (1.-smoothstep(2.-s,2.,m))*smoothstep(p,p+s,m);
	
//	v=fract(a); // this shows the net angle field

	if(d) gl_FragColor=vec4(1., 0., 0., 1.);
	else gl_FragColor = vec4(v,v,v,1.);
}
