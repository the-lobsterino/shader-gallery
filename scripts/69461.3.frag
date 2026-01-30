#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265
#define PI2 2.0*PI

float Box(vec3 p,vec3 size)
{
	vec3 q=abs(p);
	return length(max(q-size,0.0));		
}

float Sphere(vec3 p)
{
	return length(p)-0.5;	
}

vec3 foldX(vec3 p) {
    p.x = abs(p.x);
    return p;
}
 
vec3 fold(vec3 p)
{
	p=abs(p);
	if(p.x<p.y)p.xy=p.yx;
	if(p.x<p.z)p.xz=p.zx;
	if(p.y<p.z)p.yz=p.zy;
	
	return p;

	
}

mat2 rotate(float a) {
    float s = sin(a),c = cos(a);
    return mat2(c, s, -s, c);
}

vec2 foldRotate(in vec2 p, in float s) {
    float a = PI / s - atan(p.x, p.y);
    float n = PI2 / s;
    a = floor(a / n) * n;
    p *= rotate(a);
    return p;
}



float dTree(vec3 p) {
    float scale=0.8;	
    vec3 size = vec3(0.1, 1.0, 0.1);
    float d = Box(p, size);
	
	
    for(int i=0;i<7;i++)
    {
	vec3 q=foldX(p);
	//vec3 q=p; 
	q.y-=size.y;
	q.xy*=rotate(-0.5);
	d=min(d,Box(q,size));
	p=q;
	size*=scale;
    }
	
   	
    return d;
}

float DistFunk(vec3 p)
{
	float d1=Box(p,vec3(0.1,1.0,0.5));
	float d2=Sphere(p);
	p.xy=foldRotate(p.xy,10.0);
	float d3=dTree(p);
	return d3;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy*2.0-resolution) /min(resolution.x,resolution.y);

	vec3 camP=vec3(0.0,0.0,2.0)+vec3(0.0,0.5,3.5);
	vec3 camDir=vec3(0.0,0.0,-1.0);
	vec3 camUp=vec3(0.0,1.0,0.0);
	vec3 camSide=cross(camDir,camUp);
	float depth=1.0;
	
	vec3 ray=vec3(camSide*p.x+camUp*p.y+depth*camDir);
 	
	vec3 rPos=camP;
	float d=0.0;
	float h=0.0001;
	
	for(int i=0;i<256;i++)
	{
		d=DistFunk(rPos);
		if(d<0.0001)
		{
			break;	
		}
		h+=d;
		rPos= camP+ray*h*0.2;
		
		
	}
	
	if(abs(d)<0.001)
	{
		gl_FragColor=vec4(1.0);
	}else{
	
		float color = 0.2;
	
	
		gl_FragColor = vec4(vec3(color),1.0);
	}
	
	

}