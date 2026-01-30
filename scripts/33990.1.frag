//codeartist.mx

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec3 HSV2RGB(vec3 c);
void DrawCircle();
void InitPoints();

vec3 finalColor;
vec2 position ;
vec2 center=vec2(0.5,0.5);

void main( void ) {	
	position = gl_FragCoord.xy/resolution.y; //+ mouse / 4.0;	
	position.x+=-0.5;
	finalColor= vec3(1.0-position.x,1.0-position.y,position.x);		
	DrawCircle();				
	gl_FragColor=vec4(finalColor,1.0);
}

void DrawCircle(){
	float dist=0.0;
	float radius=0.25;
	float smoothness=10.0;
	float smoothValue=0.0;
	vec3 hsvColor;		
	dist= distance(center,position);		
	if(dist<radius){		
		smoothValue=smoothstep(radius*10.0, 0.0, dist*smoothness);
		hsvColor=HSV2RGB(vec3(smoothValue+time*0.5,1.0,(radius-dist)*10.0));			
		finalColor+=hsvColor;
		
	}
	
}
vec3 HSV2RGB(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
