#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MINSIZE 7.0

#define PI (3.14159265358979323)

int isign(float v){ return v > 0.0 ? 1 : -1; }

int iabs(int v){ return v >= 0 ? v : -v; }

float min(vec2 v){ return v.x < v.y ? v.x : v.y; }

void main( void )
{
	// a hack to assure odd-coordinaed pixel in the middle
	vec2 ipos = vec2(gl_FragCoord) - mod(resolution, 2.0) / 2.0 - 0.5 - resolution * 0.5;
	
	vec2 screenpos = ipos / min(resolution) / 0.5 * MINSIZE;
	float epsilon = 1.0 / (resolution.x < resolution.y ? resolution.x : resolution.y) * MINSIZE;
	
	gl_FragColor = vec4(0, 0, 0, 0); // background
	
	if(abs(screenpos.x) < epsilon) // X axis
		gl_FragColor = vec4(1, 0, 0, 1);
	if(abs(screenpos.y) < epsilon) // Y axis
		gl_FragColor = vec4(0, 1, 0, 1);
	
	// GLSL's stupid preprocessord can't
	// do a thing, so i have to feature
	// this lengthy macro
#define IN_GRAPH(f,x,y) iabs(isign((f((x - epsilon), (y - epsilon)))) + isign((f((x + epsilon), (y - epsilon)))) + isign((f((x - epsilon), (y + epsilon)))) + isign((f((x + epsilon), (y + epsilon))))) < 3

#define F(x, y) sin(y) * sin(x + time * 1.0) - cos(x) * cos(y)

vec4 outcol=vec4(0,0,0,1);
int outcount=0;

if(IN_GRAPH(F,screenpos.x,screenpos.y))
    {
		outcol=vec4(1, 0, 0, 1);
		outcount=1;
    }
else
    {
		outcount=3;
		for(int rx=-1;rx<=1;rx++)
		    for(int ry=-1;ry<=1;ry++)
                {
                //outcount+=1;
                float xx=screenpos.x+(float(rx)*epsilon);
                float yy=screenpos.y+(float(ry)*epsilon);
                if(IN_GRAPH(F,xx,yy))
                    outcol+=vec4(1,0,0,1);
                }
    }

gl_FragColor=outcol/float(outcount);
/*
#define G(x, y) -F(x - PI / 2.0, y)
	if(IN_GRAPH(G))
		gl_FragColor = vec4(0, 1, 1, 1);*/
}