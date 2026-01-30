#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define pi 3.14159265359
#define pixelSize 256.0
float round(float a){
	return floor(a + 0.5);
}
vec2 round(vec2 a){
	return vec2(round(a.x),round(a.y));
}
float atn(float x, float y){
	if(x >= 0.0){
	if(y >= 0.0) return atan(y/x);
	else return atan(y/x) + 2.0*pi;
	}else return atan(y/x) + pi;
}
void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5);

	float color = 1.0;
	uv *= pixelSize;
	uv = round(uv);
	uv /= pixelSize;
	
	if(mod(atn(uv.x,uv.y),pi) < mod(time,2.0)/2.0 * pi) color = 0.0;
	gl_FragColor = vec4( vec3( color ), 1.0 );

}