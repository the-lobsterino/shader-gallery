#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec3   iResolution = vec3(resolution, 1.0);
float  iGlobalTime = time;
vec4   iMouse = vec4(mouse, 0., 12.0);
uniform sampler2D iChannel0,iChannel1;

//String Theory by nimitz (twitter: @stormoid)

#define BASE_ANGLE 4.9
#define ANGLE_DELTA 0.5
#define XOFF .7

#define time iGlobalTime
mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,-s,s,c);}

float aspect = iResolution.x/iResolution.y;
float featureSize = 30./((iResolution.x*aspect+iResolution.y));

float f(vec2 p)
{
	p.x = tan(p.x*500.+time*10.2)*sin(time+p.x*0.)*2.;	
    p += sin(p.x*1.5)*.1;
    return smoothstep(-0.01,featureSize,abs(p.y));
}

void main(void)
{
	vec2 p = gl_FragCoord.xy / iResolution.xy*6.5-3.25;
	p.x *= aspect;
	p.y = abs(p.y);
	
	vec3 col = vec3(0);
	for(float i=0.;i<23.;i++)
	{
		vec3 col2 = (sin(vec3(5000,2.5,2.2)+i*0.15)*1.5+0.9)*(1.-f(p));
		col = max(col,col2);
		
        p.x -= XOFF;
        p.y -= sin(time*1.11+1.3)*1.5+2.5;
		p*= mm2(i*ANGLE_DELTA+BASE_ANGLE);
		
        vec2 pa = vec2(abs(p.x-.9),abs(p.y));
        vec2 pb = vec2(p.x,abs(p.y));
        
        p = mix(pa,pb,smoothstep(-.07,.7,sin(time*0.)+.9));
	}
	gl_FragColor = vec4(col,1.0);
}