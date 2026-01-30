#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
	vec2 position = (gl_FragCoord.xy - resolution * 0.5) / resolution.yy;
	
	float dx = gl_FragCoord.x-resolution.x/2.0;
	float dy = gl_FragCoord.y-resolution.y/2.0;
	//dy/=sin(time*0.4);
	float len = sqrt(dx*dx+dy*dy)*3.14;
	float md = time*0.5;
	
	float ang = 90.0*atan(dy/(len+dy));
	ang+=abs(sin(dx+dy)*.5);
	ang += pow(len, 0.395);
	
	float red = (128.0 - sin(ang + md*3.141592*2.0) * 127.0);
	float green = (128.0 - cos(ang + md*3.141592*2.0) * 127.0);
	float blue = (128.0 + sin(ang  + md*3.141592*2.0) * 127.0);

	
	float dd = length(position*2.0);
	dd=clamp(dd,0.0,1.0);
	
	
	gl_FragColor = vec4( vec3( red/255.0, green/255.0, blue/255.0)*dd, 1.0 );

}
