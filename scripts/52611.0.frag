#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

int index;

float xI;
float yI;
float timeF;
float timeG;
float d;
vec4 morphinColor;
vec2 size;
vec4 pixel;

//More nonsence~

vec4 draw(float d,vec4 pixel,vec4 morphinColor){
    if(d<12.55){
        return morphinColor;
    }
    else{
        return pixel;
    }
}

vec4 drawBorder(float d,vec4 pixel){
    if(d>=10.55&&d<12.55){
        return vec4(0.0,0.0,0.0,0.0);
    }
    else{
        return pixel;
    }
}

float jcTriangle( vec2 p, vec2 c )
{
	if (p.y>c.y+1.5){
		float w=abs(p.y-c.y);
		float q=abs(p.x-c.x)+w;
		return max(q,w);
	}
	if (p.y<=c.y+1.5&&p.y>c.y&&abs(p.x-c.x)<10.0){
		return 11.55;
	}
	else {
		return 1000.0;	
	}
}

float jcDiamond( vec2 p, vec2 c )
{
	float w=abs(p.y-c.y);
	float q=abs(p.x-c.x)+w;
	return max(q,w);
}

float jcBox( vec2 p, vec2 c )
{
	float q=abs(p.x-c.x);
	float w=abs(p.y-c.y);
	return max(q,w);
}

float jcSphere( vec2 p, vec2 b )
{
	d=distance(p,b);
	return d;
}

void main()
{
    //fetch pixel color of scene.
    //vec4 pixel = texture2D(texture, gl_TexCoord[0].xy);
    vec2 frag=gl_FragCoord.xy;
    frag.x+=cos(time)*80.0;
    frag.y+=sin(time)*50.0;
    pixel= vec4( (cos(time)*0.5+0.5),(cos(time*0.5)*0.5+0.5),(cos(time*0.2)*0.5+0.5),1.0);
    //set the size of the grid of objects
    size=vec2(4.0,4.0);
    morphinColor=vec4( 0.2+cos(time)+0.5/resolution.x, 0.2+sin(time*0.5)+0.5/resolution.y, 0.2+cos(time*0.2)+0.5/resolution.x, 1.0);
    //Here we will do a grid scan and determin positions as well as pixel color
    for (int y=0;y<10;y++){
        for (int x=0;x<10;x++){
            //2d to 1d index
            index=4*y+x;

            timeF=time*1.0+float(int(size.y)*y+y) *0.1;
	    timeG=time*1.0+float(int(size.x)*x+x) *0.1;

            xI=float(x)*64.55 -(size.x*64.55)*0.5 +resolution.x*0.5  -(-cos(timeF)*100.0);
            yI=float(y)*64.55 -(size.y*64.55)*0.5 +resolution.y*0.5  -(sin(timeG)*100.0);
		
	    //offset the grid
		float gClock=sin(time*0.2);
		if(gClock>0.5 && gClock<=1.0){
		    xI+=50.0;
            	    yI+=50.0;
		    //Use box distance check
		    d=jcBox(frag.xy,vec2(xI,yI))+cos(time)*10.0;
		    //Render a sphere at this point
		    pixel = draw(d,pixel,morphinColor);
		    pixel = drawBorder(d,pixel);
		}
		else if(gClock<=0.5 && gClock>0.0){
			
		    //Render a sphere at this point
		    xI-=100.0;
		    yI-=100.0;
		    d=jcSphere(frag.xy,vec2(xI,yI)+sin(time))*0.5;
		    pixel = draw(d,pixel,morphinColor);
		    pixel = drawBorder(d,pixel);
		}
		else if(gClock<=0.0 && gClock>-0.5){
		    //offset the grid
		    xI-=150.0;
		    yI-=150.0;
		    //Use box distance check
		    d= jcDiamond(frag.xy,vec2(xI,yI)-cos(time)*20.0);
		    //Render a sphere at this point
		    pixel = draw(d,pixel,morphinColor);
		    pixel = drawBorder(d,pixel);
		}
		else if(gClock<=-0.5 && gClock>=-1.0){
		    //offset the grid
		    xI-=50.0;
		    yI-=50.0;
		    //Use box distance check
		    d= jcBox(frag.xy,vec2(xI,yI));
		    //Render a sphere at this point
		    pixel = draw(d,pixel,morphinColor);
		    pixel = drawBorder(d,pixel);
		    d=jcSphere(frag.xy,vec2(xI,yI));
		    pixel = draw(d,pixel,morphinColor);
		    pixel = drawBorder(d,pixel);
		    //offset the grid
		    //Use box distance check
		    xI-=cos(time)*6.0;
		    yI-=sin(time)*6.0;
		    d= jcDiamond(frag.xy,vec2(xI,yI));
		    //Render a sphere at this point
		    pixel = draw(d,pixel,morphinColor);
		    pixel = drawBorder(d,pixel);
		}
        }
    }
    gl_FragColor = pixel;
}