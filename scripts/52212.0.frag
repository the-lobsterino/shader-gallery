#ifdef GL_ES
precision  highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform sampler2D texture;

uniform vec2 resolution;
uniform vec2 mouse;

const float saturation = 0.5;
const float smokeOp= 0.06;
const vec4 envColor = vec4(0.2,0.22,0.3,1.0);
const vec4 minEnvColor = vec4(0.1,0.2,0.31,1.0);


vec2 posl[3];// light position  
vec4  cl[3]; // light color
float il[3]; // light intensity
float gl[3]; // light glow

vec4 obs[3];  // obstacle
float oobs[3];// obstacle opacity

vec2 uv;

vec4 sat(vec4 c,float val)
{
	val = (1./6.)*val*val + (1./2.)*val+ 1./3.;
	float r,g,b, ml = (1.0 - val)/2.0;
	
	r = c.r * val + c.g*ml + c.b*ml;
	g = c.r * ml + c.g*val + c.b*ml;
	b = c.r * ml + c.g*ml + c.b*val;
	return vec4(r,g,b,c.w);	
}

float cross2(vec2 v1,vec2 v2)
{
	return 	v1.x *v2.y - v1.y *v2.x;
}

bool isCross(vec2 p1,vec2 p2,vec2 p3,vec2 p4)
{
	if(cross2(p4-p3, p1-p3) *cross2(p4-p3, p2-p3) < 0.0)
		if(cross2(p1-p2, p1-p3) *cross2(p1-p2, p2-p4) < 0.0)		
			return true;
		
	return false;
}
float crossc(vec2 p1)
{
	float res = 1.0;
	for(int i = 0; i < 3; i++)	
		 if(isCross(vec2(obs[i].x,obs[i].y) , vec2(obs[i].z,obs[i].w),uv,p1))
			 res = oobs[i];
	
	return res;
}
vec4 vignete(vec4 color)
{
    vec4 res = color;
    
    if(uv.x < 0.1 ){
        res *=   ( pow(uv.x/0.1,0.1)) ;
    }
    if(uv.x > resolution.x/resolution.y -0.1 ){
        res *=   (  pow(1.0-(uv.x - resolution.x/resolution.y +0.1)/0.1,0.1)) ;
    }


    if(uv.y < 0.1 ){
        res *=   ( pow(uv.y/0.1,0.1)) ;
    }
    if(uv.y > 0.9 ){
        res *=   (  pow(1.0-(uv.y - 0.9)/0.1,0.1)) ;
    }
    return res;
    }

float rand(vec2 x){
    return fract(sin(dot(x, vec2(12.9898, 12.9898 * 1.321))) * 43758.5453);
}

uniform float time;
uniform sampler2D bb;

void main() {
    


	uv = ( gl_FragCoord.xy / resolution.y) ;
	uv.y = 1.0-uv.y;

	obs[0] = vec4(0.592,0.63,0.592,0.907);  
	obs[1] = vec4(1.48,0.907,1.48,0.63);    
	obs[2] = vec4(0.592,0.907,1.48,0.907);  

	oobs[0] = 0.0; 
	oobs[1] = 0.0; 
	oobs[2] = 0.3; 
	//posl[0] = vec2(.747,0.809);
	
	posl[0] = vec2(mouse.x*resolution.x /resolution.y,1.0 -mouse.y) + 0.06 * (vec2(rand(uv * time), rand(uv* time+10.0)) * 2.0 - 1.0);
	//posl[0] = vec2(.747,0.809);  
	posl[1] = vec2(1.58,0.37);   
	posl[2] = vec2(1.29,0.78);   
	
	
	cl[0] = vec4(1.0,0.54,0.18,1.0);  
	cl[1] = vec4(1.0,1.0,.9,1.0);     
	cl[2] = vec4(1.0,0.03,0.0,1.0);   
	
	il[0] = 0.633430;   
	il[1] = 0.7334460;  
	il[2] = 0.5;        
	
	gl[0] = 0.852430;   
	gl[1] = 1.5002360;  
	gl[2] = .7017;      
	
	vec4 resc;
	
	for(int i = 0; i < 1; i++)
	{
		resc +=  cl[i] * pow(( il[i]/pow( distance(uv,posl[i]), il[i]) ) , 1.0/gl[i] ) * crossc(posl[i]);
	}
    
	vec4 c = vignete( envColor * max(minEnvColor , resc)) +  smokeOp;
	gl_FragColor = mix(c, texture2D(bb, ( gl_FragCoord.xy / resolution.xy) ), 0.95);
}