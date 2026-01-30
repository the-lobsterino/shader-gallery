#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float noise(vec2 P){
return abs(fract(sin(dot(P, vec2(1.0,10007.0)))*4826.7241)*4826.7241);
}
float line(in float m, float c, vec2 point)
{
	return (m*point.x + c - point.y);
}

void main( void ) {

	float a = 0.0;
	float b = 0.0;
	float c = 0.0;
	
	//float k = line(1.0,60.0,gl_FragCoord.xy); if(k > 0.0) a = a + 0.4;
	int s = 0;
	float k1 = line(-1.0,160.0,gl_FragCoord.xy); if(k1 < 0.0) s = 1;
	float k2 = line(1.0,-20.0,gl_FragCoord.xy); if(k2 > 0.0) {if(s == 1) s = 1;}else s = 0;
	float k3 = line(-1.0,620.0,gl_FragCoord.xy); if(k3 > 0.0) {if(s == 1) s = 1;}else s = 0;
	float k4 = line(1.0,-60.0,gl_FragCoord.xy); if(k4 < 0.0) {if( s == 1) s = 1;}else s = 0;
	if(s == 1)
		b = 0.4;
	gl_FragColor = vec4( vec3( a, b,  c ), 1.0 );

}