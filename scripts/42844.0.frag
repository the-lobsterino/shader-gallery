#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash( vec2 p ) {
	float h = dot(p,vec2(127.1,311.7));	
    return fract(sin(h)*4758.5453123);
}

float noise( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );	
	vec2 u = f*f*(3.0-2.0*f);
    return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

void main() {

	vec2 position =1.0*(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x,resolution.y);

	float v=0.0;
	float ii=0.0;
	float rg=1.0;
	int f=0;

	// White	
	for(int i=0;i<2;i++)
	{
		vec2 n1=rg*vec2(sin(time+ii),cos(time+ii));
		vec2 n2=rg*vec2(cos(time+ii),sin(time+ii));
		vec2 pos=vec2(noise(n1)/2.0,noise(n2)/2.0);
		//vec2 pos=vec2(0.0,0.0);
		float l1 = 0.5/length(pos - position);
		if( f==0 )
		{
			v+=l1;
			f=1;
		}
		ii+=1.0;
	}
	
	// black
	float r1=0.02;
	float r2=0.02;
	vec2 pos=vec2(0.0,0.5);
	float l1 = r1/length(pos - position);
	v-=l1;
	pos=vec2(0.0,0.3);
	l1 = r2/length(pos - position);
	v-=l1;
	pos=vec2(0.0,0.2);
	l1 = r2/length(pos - position);
	v-=l1;
	pos=vec2(0.0,0.1);
	l1 = r2/length(pos - position);
	v-=l1;
	pos=vec2(0.0,0.0);
	l1 = r2/length(pos - position);
	v-=l1;
	// 
	pos=vec2(-0.1,0.3);
	l1 = r2/length(pos - position);
	v-=l1;
	pos=vec2(-0.2,0.25);
	l1 = r2/length(pos - position);
	v-=l1;
	// 
	pos=vec2(0.1,0.3);
	l1 = r2/length(pos - position);
	v-=l1;
	pos=vec2(0.2,0.25);
	l1 = r2/length(pos - position);
	v-=l1;
	//
	pos=vec2(-0.05,-0.05);
	l1 = r2/length(pos - position);
	v-=l1;
	pos=vec2(-0.10,-0.10);
	l1 = 0.01/length(pos - position);
	v-=l1;
	pos=vec2(-0.15,-0.15);
	l1 = r2/length(pos - position);
	v-=l1;
	//
	pos=vec2(0.05,-0.05);
	l1 = r2/length(pos - position);
	v-=l1;
	pos=vec2(0.10,-0.10);
	l1 = 0.01/length(pos - position);
	v-=l1;
	pos=vec2(0.15,-0.15);
	l1 = r2/length(pos - position);
	v-=l1;
	
	
	//v=pow(v,1.5);
	gl_FragColor = vec4(vec3(v),1.0);
}
