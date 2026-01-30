#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec2 POINTS[3];
vec3 HSV2RGB(vec3 c);
void DrawPoints();
void InitPoints();
vec3 finalColor;
vec2 position ;
void main( void ) {
	
	position =  gl_FragCoord.xy/resolution.xy; //+ mouse / 4.0;
	position.x*=2.0;
	position.x+=-0.5;

	finalColor= vec3(0,0,0);	
	InitPoints();
	DrawPoints();
	//dist+=time*0.1;
	
	//dist *= smoothstep( dist, dist+0.01, length (q));
	
	//vec3 hsvColor=hsv2rgb(vec3(dist,1.0,1.0));
		
	
	gl_FragColor = vec4(finalColor,1.0);

}
void InitPoints(){
	POINTS[0]=vec2(0.5,0.5);
	POINTS[1]=vec2(0.5,0.8);
	POINTS[2]=vec2(0.5,0.2);
}
void DrawPoints(){
	float dist=0.0;
	float radius=0.1;
	float smoothness=10.0;
	float smoothValue=0.0;
	for(int i=0;i<3;i++){
	dist= distance(POINTS[i],position);		
		if(dist<radius){		
			smoothValue=smoothstep( 1.0,0.0, dist*smoothness);
			finalColor=HSV2RGB(vec3(smoothValue+time*0.2,1.0,1.0));			
		}
	}
}
vec3 HSV2RGB(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}