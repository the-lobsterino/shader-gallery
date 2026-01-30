#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform sampler2D backbuffer;

vec2 pixel;
vec4 Color, FB_Color;

float xPixel = 1./resolution.x;
float yPixel = 1./resolution.y;

vec3 min_color = vec3(0.002);

vec4 GetPixel(vec2 Pos, sampler2D TexGet)
{
	vec4 ColorGet = texture2D(TexGet, Pos);
	
	return ColorGet;

}

void main( void ) {


pixel = (gl_FragCoord.xy / resolution.xy);


FB_Color = texture2D(backbuffer,vec2(pixel.x, pixel.y));
	
vec4 R_Color_1 = texture2D(backbuffer,vec2(pixel.x+xPixel,pixel.y));
vec4 L_Color_1 = texture2D(backbuffer,vec2(pixel.x-xPixel,pixel.y));
vec4 U_Color_1 = texture2D(backbuffer,vec2(pixel.x,pixel.y+yPixel));
vec4 D_Color_1 = texture2D(backbuffer,vec2(pixel.x,pixel.y-yPixel));
	


	


float dist = distance(gl_FragCoord.xy, mouse.xy * resolution.xy);
if(dist < 1.)
if(mouse.x < 0.9)Color.rgb += 10.0;//0.00143;

		
	/*

	R_Color_1.rgb += (
			GetPixel(vec2(pixel.x+xPixel*2., pixel.y), backbuffer).rgb + 
			GetPixel(vec2(pixel.x,           pixel.y), backbuffer).rgb +  
			GetPixel(vec2(pixel.x+xPixel,    pixel.y+yPixel), backbuffer).rgb +  
			GetPixel(vec2(pixel.x+xPixel,    pixel.y-yPixel), backbuffer).rgb 
		) / 8.;
	
	L_Color_1.rgb += (
			GetPixel(vec2(pixel.x-xPixel*2., pixel.y), backbuffer).rgb + 
			GetPixel(vec2(pixel.x,           pixel.y), backbuffer).rgb +  
			GetPixel(vec2(pixel.x-xPixel,    pixel.y+yPixel), backbuffer).rgb +  
			GetPixel(vec2(pixel.x-xPixel,    pixel.y-yPixel), backbuffer).rgb 
		) / 8.;
	
	U_Color_1.rgb += (
			GetPixel(vec2(pixel.x,		 pixel.y-xPixel*2.), backbuffer).rgb + 
			GetPixel(vec2(pixel.x,           pixel.y), backbuffer).rgb +  
			GetPixel(vec2(pixel.x+xPixel,    pixel.y+yPixel), backbuffer).rgb +  
			GetPixel(vec2(pixel.x-xPixel,    pixel.y+yPixel), backbuffer).rgb 
		) / 8.;	
	
	D_Color_1.rgb += (
			GetPixel(vec2(pixel.x,		 pixel.y+xPixel*2.), backbuffer).rgb + 
			GetPixel(vec2(pixel.x,           pixel.y), backbuffer).rgb +  
			GetPixel(vec2(pixel.x+xPixel,    pixel.y-yPixel), backbuffer).rgb +  
			GetPixel(vec2(pixel.x-xPixel,    pixel.y-yPixel), backbuffer).rgb 
		) / 8.;*/	
	

	
			

	
	if(U_Color_1.r < D_Color_1.r){Color.rgb = D_Color_1.rgb - min_color;} 
	if(U_Color_1.r > D_Color_1.r){Color.rgb = U_Color_1.rgb - min_color;}
	if(R_Color_1.r < L_Color_1.r){Color.rgb = L_Color_1.rgb - min_color;} 
	if(R_Color_1.r > L_Color_1.r){Color.rgb = R_Color_1.rgb - min_color;}
	 
	 



	
	
	
	//CLEAR SCREEN
	if(mouse.x < 0.002)Color.rgb = vec3(0.0);
	//Color.rgb = vec3(0.0);
	



	


gl_FragColor = Color;
		gl_FragColor = vec4(gl_FragColor.xyz,1.0);
}