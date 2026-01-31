#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

void main( void ) 
{
	vec2 r = resolution;
	vec2 z = surfaceSize*r;
	vec2 s = surfacePosition;
	vec2 p = s*z;//(gl_FragCoord.xy - resolution * 0.5) / resolution.yy;
	
	float t = time*1e-3;
	float longest = sqrt(float(s.x*s.x) + float(s.y*s.y))*0.5;
	p/=dot(p,p);
	float dx = p.x-s.x/2.0;
	float dy = p.y-s.y/2.0;
	float len = sqrt(dx*dx+dy*dy);
	float ds = len/longest;
	float md = ds-t*9.0;
	
	float ang = 2.0*atan(md-dy/(len+dx));
	ang += pow(len, 10.5)*5.0;
	
	float red = (128.0 - sin(ang + t*3.141592*2.0) * 127.0)*(1.0-ds);
	float green = (128.0 - cos(ang + t*3.141592*2.0) * 127.0)*(1.0-ds);
	float blue = (128.0 + sin(ang  + t*3.141592*2.0) * 127.0)*(1.0-ds);

	gl_FragColor = vec4( fract(vec3( red, green, blue)), 1.0 );

}
