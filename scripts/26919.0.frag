#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_DEPTH 5
vec4 GetColor(vec2 p)
{

	for(int depth=0;depth<MAX_DEPTH;++depth)
	{
		if(p.x<0.0||p.y<0.0||p.x>=1.0||p.y>=1.0){return vec4(0.0);}
		ivec2 coord=ivec2(p*3.0);
		int factor=coord.x+coord.y;
		//is there any ways to find if this is even or odd?
		if(factor==1||factor==3||factor==5||factor==7){return vec4(0.0);}
		
		p=mod(p,vec2(0.33333333333))*3.0;
	}
	return vec4(1.0);
}

void main( void ) {
	float width=mouse.x*1000.0+100.0;
	vec2 startpoint=resolution*0.5 - vec2(width*0.5);
	
	vec2 p=(gl_FragCoord.xy-startpoint)/width;
	//if(p.x>0.0&&p.y>0.0&&p.x<1.0&&p.y<1.0){gl_FragColor=vec4(1.0);}
	
	gl_FragColor=GetColor(p);
}