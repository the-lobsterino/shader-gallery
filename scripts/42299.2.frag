#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float w = 10., h = w/(resolution.x/resolution.y);
void main( void ) {

	vec2 R = resolution, uv = gl_FragCoord.xy / R;
	
	vec3 c = vec3(0);
	
	float x = uv.x,
		y = uv.y;
	
	x=floor(x*w)/w;
	y=floor(y*h)/h;
	
	
	float fx = fract(uv.x*w);
	float fy = fract(uv.y*h);
	
	float i = mod(y*h,2.);
	
	if (i>0.)
		fy = 1.-fy;
	
	float z = floor((2.*fx)+fy) * floor((2.-2.*fx)+fy);
	
	if (i>0.)
		z = 1.-z;
	
	c = vec3(abs(sin(vec3(x,y,z)+time/10.))) * vec3(1.4,1,1.5);
	
	gl_FragColor = vec4( c*c, 1.0 );

}