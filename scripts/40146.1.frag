#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform sampler2D backbuffer;

//4 bc 4 color theorem?

// id -> center position and radius
vec3 IdToCenterRadius(float x,float y)
{
	return(vec3((x-2.0)*0.4,(y-2.0)*0.4,0.195));
}

// id -> color
vec4 IdToColor(float x,float y)
{
	float m=mod(x+y,4.0);
	if(m==0.0)
	{
		return vec4(1.,0.0,0.0,1.0);	
	}
	else if(m==1.0)
	{
		return vec4(0.0,1.,0.0,1.0);	
	}
	else if(m==2.0)
	{
		return vec4(0.0,0.0,1.,1.0);	
	}
	else
	{
		return vec4(1.0,1.0,0.0,1.0);	
	}
}

bool IsInside(vec2 pos, vec3 centerRadious)
{
	float dx=pos.x-centerRadious.x;
	float dy=pos.y-centerRadious.y;
	float r=centerRadious.z;
	return(dx*dx+dy*dy<r*r);
}

vec4 PositionToColor(vec2 pos)
{
	for(float y=0.0;y<5.0;y++)
	{
	for(float x=0.0;x<5.0;x++)
	{
           if(IsInside(pos,IdToCenterRadius(x,y)))
	   {
		return(IdToColor(x,y));
	   }
	}
	}
	return(vec4(0.0,0.0,0.0,0.0));		   
}

vec2 OriginalPositionToNormalizedPosition(vec2 v)
{
	return vec2(
		(v.x*2.0-resolution.x)/resolution.y,
		(v.y*2.0-resolution.y)/resolution.y
		);
}

vec2 NomalizedPositionToOriginalPosition(vec2 v)
{
	return vec2(
		(v.x*resolution.y+resolution.x)*0.5,
		(v.y*resolution.y+resolution.y)*0.5
		);
}

vec4 Blend(vec4 original,vec4 last)
{
	if(original.a==0.0){
		return(original);
	}else if(last.a==0.0){
		return(original);	
	}else{
		return((last*7.0+original)/8.0);
	}
}

vec2 ToReflectedPosision(vec2 pos)
{
	for(float y=0.0;y<5.0;y++)
	{
	for(float x=0.0;x<5.0;x++)
	{
           vec3 cr=IdToCenterRadius(x,y);	
           if(IsInside(pos,cr))
	   {
		vec2 pos2=vec2(pos.x-cr.x,pos.y-cr.y);
		float r2=pos2.x*pos2.x+pos2.y*pos2.y;
		float r=sqrt(r2);
		float i=cr.z*cr.z/r2;
		vec2 pos3=pos2*i;
		vec2 pos4=vec2(pos3.x+cr.x,pos3.y+cr.y);   
 	        return(pos4);
	   }
	}
	}
	return(vec2(0.0,0.0));
}

void main( void )
{
	
	vec2 npos 	= OriginalPositionToNormalizedPosition(gl_FragCoord.xy);
	
	vec2 a 		= resolution/min(resolution.x, resolution.y);
	vec2 m 		= OriginalPositionToNormalizedPosition(mouse*resolution);
	
	vec2 npos2	= ToReflectedPosision(npos);
	
	vec2 opos	= NomalizedPositionToOriginalPosition(npos2-m);

	float l		= clamp(.1/(.15/(min(length(npos-m),length(npos2-m)))), 0., 1.);
	//l		-= (length(normalize(1./(opos-m))-npos2));
	
	vec2 texPos 	= vec2(opos/resolution);
	vec4 lastColor  = texture2D(backbuffer, texPos);
	lastColor 	+= clamp((.015/l)+.125/exp(l), 0., 1.);
	
	gl_FragColor = Blend(PositionToColor(npos),lastColor);
}
