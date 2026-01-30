#ifdef GL_ES
precision mediump float;
#endif

////mayrQ

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec3 r) { return fract(sin(dot(r.xy,vec2(1.38984*-tan(r.z),1.13233*tan(r.z))))*653758.5453); }

vec2 threshold(vec2 threshold,vec2 x,vec2 low,vec2 high)
{
	return low+step(threshold,x)*(high-low);
}

void main(void)
{
	vec2 position=(2.0*gl_FragCoord.xy-resolution)/min(resolution.x,resolution.y);

	vec2 topleft=vec2(-1.0);
	vec2 bottomright=vec2(1.0);
	float col=10.0;

	for(int i=0;i<15;i++)
	{
		vec2 midpoint=(topleft+bottomright)/2.0;
		vec2 diagonal=bottomright-topleft;

		//if(position.x>bottomright.x || position.y>bottomright.y) break;
		//if(position.x<topleft.x || position.y<topleft.y) break;

		if(rand(vec3(topleft,floor(position.x+position.y+time/2.0)+1.0))<0.7)
		{
			if(length(position-midpoint)>length(diagonal)*0.5) break;
			topleft+=diagonal*0.15;
			bottomright-=diagonal*0.15;
			col*=-1.0;
		}
		else
		{
			topleft=threshold(midpoint,position,topleft,midpoint);
			bottomright=threshold(midpoint,position,midpoint,bottomright);
		}
	}

	gl_FragColor=vec4(vec3(col*0.1+0.2),3.0);
}
