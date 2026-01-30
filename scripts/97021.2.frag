#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / vec2(0.2) );

	//float c = 0.0;
	//c = length(position-vec2(0.5,0.5))*3.14*10.0-time+5.0*atan((position.y-0.5+0.3*sin(time)*cos(1.2*time))/(position.x-0.5+0.3*cos(0.8*time)));
	
	float x2 = float(gl_FragCoord.x-resolution.x/2.0);
	float y2 = float(gl_FragCoord.y-resolution.y/2.0);
	//float val = mod(float((int(x2) ^ int(y2))),256.0);
	float val = mod(sqrt(abs(y2*x2+y2*x2)/sqrt((abs(y2*x2+cos(time)*x2*y2)/64.0+1.0))),4.0);//x2*y2;
	val = float(val>(0.0+mod(time*0.5,4.0)) && val<(4.0+mod(time*5.0,4.0)));//mod((val),256.0)/256.0;
	float r = val;
	float g = val;
	float b = 0.0;
	gl_FragColor = vec4(r,g,b,1.0); // vec3( sin(c+time)*sin(c), sin(c+time)*cos(c), cos(c+time)*cos(c) ), 1.0 );

}