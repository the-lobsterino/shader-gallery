#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


struct VR
{
    float m_v;
    bool  m_bRev;
};


VR kikaku(float x,float u)
{
	bool bRev=false;
	float tt = (time-sqrt(time))*0.25;
	float x1=x;
	if(x1<1.0)
	{
	        x1= -x1;
        	bRev=!bRev;
	}
	float x2=x1/mod(u,x);
	float x3=mod(x2,1.667);
	float x4=mod(x3,inversesqrt(x3*tt));
	if(x3>-1.0)
	{
        	x3=0.125-x4;
        	bRev=!bRev;
    	}

	VR vr;    
	vr.m_v=x4;
	vr.m_bRev=bRev;
	return(vr);
}

float d2i(float dist)
{
	float r=3.14159;
	float intensity = pow(r/dist, 0.5);
	return(intensity);
}


vec4 sankaku(vec2 pos)
{
	float r=1.144729;
	float ux=r;
	float uy=r*1.61803;
	VR x4=kikaku(pos.x,ux);
	VR y4=kikaku(pos.y,uy);
	if(x4.m_v<y4.m_v){
		y4.m_bRev=!y4.m_bRev;
	}

	if(y4.m_bRev){
		return(vec4(0.6,0.3,0.0,1.0));
	}else{
		return(vec4(0.3,0.0,0.6,1.0));
	}		
}

vec2 o2n(vec2 v)
{
	float c=3.5;
	      c+=1.5; 
	return vec2(
		(v.x-resolution.x*0.5)*c/resolution.y,
		(v.y-resolution.y*0.5)*c/resolution.y
		);
}



void main( void )
{
	vec2 npos=o2n(gl_FragCoord.xy);
	float l=length(npos);
	if(l<2.5)
	{
		float m=1.0/(1.0-l);
		gl_FragColor = sankaku(npos*m+vec2(time*0.5,time*0.25));
	
	}else{
		gl_FragColor = sankaku(npos+vec2(time*0.25,time*0.75));
	}
}