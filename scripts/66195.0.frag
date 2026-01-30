// 200720N Mandelbrot Wallpaper

#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
#define iTime time
#define iResolution resolution
#define A5
const vec4 iMouse = vec4(0.0);




vec2 square(vec2 z)
{
	float x = z.x, y = z.y;
	return vec2(x * x - y * y, 2.0 * x * y);
}

float mandelbrot(vec2 c)
{
	int MAX_ITERATION = 120;
	
	vec2 z = c;
	float count = 0.0;
	
	for (int i = 0; i < 120; i++)
	{
		z = square(z) + c;
		if (length(z) > 2.0) break;
		
		count += 1.0;
	}
	
	return (count / float(MAX_ITERATION));
}



const float PI=3.14159265358979323846;

#define speed iTime
float ground_x=0.0;//+0.125*sin(PI*speed*0.25);
float ground_y=0.0;//+0.125*cos(PI*speed*0.
#define ground_z (4.0*sin(PI*speed*0.0625))

float rand(in vec2 p,in float t,in float v)
	{
	return fract(sin(dot(p+mod(t,1.0),vec2(12.9898,78.2333)))*v);
	}

vec2 rotate(vec2 k,float t)
	{
	return vec2(cos(t)*k.x-sin(t)*k.y,sin(t)*k.x+cos(t)*k.y);
	}

float scene(vec3 p)
	{
	float bar_p=1.0;
		float mb = mandelbrot(p.xy);
	float bar_w=bar_p*(0.125+0.03125*float(1.0+2.0*sin(PI*p.z*2.0-PI*0.5)));
	float bar_x=length(max(abs(mod(p.yz,bar_p)-bar_p*0.5)-bar_w,0.0))*mb;
	float bar_y=length(max(abs(mod(p.xz,bar_p)-bar_p*0.5)-bar_w,0.0))*mb;
	float bar_z=mb;//* length(max(abs(mod(p.xy,bar_p)-bar_p*0.5)-bar_w,0.0))*mb;
	
	return -max(max(-bar_x,-bar_y),-bar_z);
	}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
	{
	vec2 position=(fragCoord.xy/iResolution.xy);
	vec2 p=-1.0+2.0*position;
	vec3 dir=normalize(vec3(p*vec2(1.0/iResolution.y*iResolution.x,1.0),1.0));	// screen ratio (x,y) fov (z)
	dir.yz=rotate(dir.yz,PI*0.5*sin(speed*0.25));	// rotation x
	//dir.zx=rotate(dir.zx,speed*0.5);				// rotation y
	dir.xy=rotate(dir.xy,PI*1.0*cos(speed*0.25));	// rotation z
	vec3 ray=vec3(ground_x,ground_y,ground_z);
	float t=0.0;
	const int ray_n=64;
	for(int i=0;i<ray_n;i++)
		{
		float k=scene(ray+dir*t);
        if(abs(k)<0.001) break;
		t+=k*0.5;
		}
	vec3 hit=ray+dir*t;
	vec2 h=vec2(0.005,-0.005);
	vec3 n=normalize(vec3(scene(hit+h.xyy),scene(hit+h.yxx),scene(hit+h.yyx)));
	float c=(n.x*2.0+n.y+n.z)*0.25-t*0.025;
	vec3 color=vec3(c*t*0.625-p.x*0.125,c*t*0.25+t*0.03125,c*0.375+t*0.0625+p.y*0.125);
	color=smoothstep(0.4,0.7,c)+color*color;
	/* post process */
	color*=0.6+0.4*rand(p,iTime,43758.5453);
	color=vec3(color.x*0.9-0.1*cos(p.x*iResolution.x),color.y*0.95+0.05*sin(p.y*iResolution.x/2.0),color.z*0.9+0.1*cos(PI/2.0+p.x*iResolution.x));
	/* return color */
	fragColor=vec4(color,1.0);
	}





void main(void)
{
//iMouse = vec4(mouse * resolution, 0.0, 0.0);    
mainImage(gl_FragColor, gl_FragCoord.xy);
gl_FragColor.a = 1.0;
}