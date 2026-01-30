#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define pixelSize 0.03 
#define black vec3(0)
#define red vec3(1,0,0)
#define skin vec3(0.89,0.95,0.85)
#define blue1 vec3(0.55,0.64,0.75)
#define blue2 vec3(0.07,0.07,0.49)
#define green1 vec3(0.45,1,0)
#define green2 vec3(0.23,0.82,0.38)
#define green3 vec3(0.18,0.62,0.29)
vec2 uv;
vec3 colorBuffer;
void setPixel(float x, float y, vec3 color){
	x *= pixelSize;
        y *= pixelSize;
	if(uv.x > x && uv.y > y  && uv.y - y < pixelSize && uv.x - x < pixelSize ){
	colorBuffer = color;	
	}
	
}
void main( void ) {
uv = gl_FragCoord.xy/resolution.xy * vec2(resolution.x/resolution.y,1);
        colorBuffer = vec3(1);
	setPixel(30.0,5.0,black);
	setPixel(31.0,5.0,black);
	setPixel(32.0,5.0,black);
	setPixel(33.0,5.0,black);
	setPixel(34.0,5.0,black);
	setPixel(30.0,6.0,red);
	setPixel(31.0,6.0,red);
	setPixel(32.0,6.0,red);
	setPixel(31.0,7.0,red);
	setPixel(32.0,7.0,red);
	setPixel(33.0,7.0,red);
	setPixel(32.0,8.0,red);
	setPixel(33.0,8.0,red);
	setPixel(31.0,8.0,skin);
	setPixel(30.0,8.0,skin);
	setPixel(34.0,8.0,skin);
	setPixel(30.0,9.0,skin);
	setPixel(30.0,10.0,skin);
	setPixel(32.0,9.0,black);
	setPixel(33.0,9.0,black);
	setPixel(31.0,9.0,black);
	setPixel(31.0,10.0,black);
	setPixel(32.0,10.0,black);
	setPixel(33.0,10.0,black);
	setPixel(32.0,11.0,black);
	setPixel(31.0,11.0,skin);
	setPixel(33.0,11.0,blue1);
	setPixel(32.0,12.0,blue1);
	setPixel(31.0,12.0,black);
	setPixel(30.0,12.0,black);
	setPixel(29.0,12.0,black);
	setPixel(28.0,12.0,black);
	setPixel(27.0,13.0,black);
	setPixel(27.0,14.0,black);
	setPixel(27.0,15.0,black);
	setPixel(27.0,16.0,black);
	setPixel(26.0,14.0,green2);
	setPixel(26.0,15.0,green3);
	setPixel(25.0,16.0,green3);
	setPixel(25.0,17.0,green1);
	setPixel(33.0,12.0,black);
	setPixel(34.0,12.0,black);
	setPixel(35.0,12.0,black);
	setPixel(36.0,13.0,black);
	setPixel(37.0,14.0,green2);
	setPixel(37.0,15.0,green2);
	setPixel(36.0,15.0,blue1);
	setPixel(36.0,16.0,blue1);
	setPixel(35.0,17.0,blue1);
	setPixel(34.0,17.0,blue1);
	setPixel(34.0,16.0,blue1);
	setPixel(33.0,17.0,blue1);
	setPixel(32.0,17.0,blue1);
	setPixel(28.0,16.0,blue1);
	setPixel(28.0,17.0,black);
	setPixel(29.0,17.0,black);
	setPixel(30.0,17.0,black);
	setPixel(31.0,17.0,black);
	setPixel(31.0,16.0,skin);
	setPixel(30.0,16.0,skin);
	setPixel(31.0,15.0,skin);
	setPixel(30.0,15.0,skin);
	setPixel(31.0,14.0,skin);
	setPixel(30.0,14.0,skin);
	setPixel(31.0,13.0,skin);
	setPixel(30.0,13.0,skin);
	setPixel(33.0,16.0,skin);
	setPixel(32.0,16.0,skin);
	setPixel(33.0,15.0,skin);
	setPixel(32.0,15.0,skin);
	setPixel(33.0,14.0,skin);
	setPixel(32.0,14.0,skin);
	setPixel(33.0,13.0,skin);
	setPixel(32.0,13.0,skin);
	setPixel(36.0,14.0,skin);
	setPixel(35.0,13.0,skin);
	setPixel(34.0,13.0,skin);
	setPixel(35.0,14.0,blue2);
	setPixel(35.0,15.0,blue2);
	setPixel(35.0,16.0,blue2);
	setPixel(29.0,14.0,blue2);
	setPixel(29.0,15.0,blue2);
	setPixel(29.0,16.0,blue2);
	setPixel(34.0,14.0,skin);
	setPixel(34.0,15.0,skin);
	setPixel(29.0,13.0,skin);
	setPixel(28.0,13.0,skin);
	setPixel(28.0,14.0,skin);
	setPixel(28.0,15.0,skin);
	setPixel(28.0,18.0,red);
	setPixel(29.0,18.0,red);
	setPixel(27.0,18.0,red);
	setPixel(27.0,17.0,red);
	setPixel(30.0,18.0,red);
	setPixel(31.0,18.0,red);
	setPixel(32.0,18.0,red);
	setPixel(33.0,18.0,red);
	setPixel(34.0,18.0,red);
	setPixel(35.0,18.0,red);
	setPixel(36.0,18.0,red);
	setPixel(36.0,17.0,red);
	setPixel(37.0,18.0,red);
	setPixel(38.0,18.0,red);
	setPixel(28.0,19.0,red);
	setPixel(29.0,19.0,skin);
	setPixel(30.0,19.0,skin);
	setPixel(31.0,19.0,skin);
	setPixel(32.0,19.0,skin);
	setPixel(33.0,19.0,skin);
	setPixel(34.0,19.0,skin);
	setPixel(35.0,19.0,skin);
	gl_FragColor = vec4( vec3(colorBuffer), black);

}