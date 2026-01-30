#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pi = atan(1.)*4.;

//#define FISHEYE

vec3 rotate(vec3 axis, float ang, vec3 vec)
{
	axis = normalize(axis);
	return vec * cos(ang) + cross(axis, vec) * sin(ang) + axis * dot(axis, vec) * (1.0 - cos(ang));
}
vec3 swr(vec3 p){
	vec3 col = vec3(sin(p));
	vec3 c = col;
	for(int i=1; i<6; i++)	{
		float ii = float(i);
		col.xyz=(sin((col.zxy+col.yzx)*ii))*(sin((col.zxy*col.yzx)*ii));
		c=cos(p*ii+col*3.14);
		col = mix(c*c,col,sin(p.z)*0.49+0.5);
	}
	return col;
}
void main( void ) {

	vec2 res = vec2(resolution.x/resolution.y,1.0);
	vec2 p = ( gl_FragCoord.xy / resolution.y );
	vec2 cen = res / 2.0;
	
	vec2 look = (mouse-0.5)*2.0*pi;
	look.y = -clamp(look.y,-pi/2.0,pi/2.0);
	
	vec3 col = vec3(0.0);
	
	float f = 0.5;

	vec3 camDir = normalize(vec3(p-cen,f));
	
	camDir = rotate(vec3(1,0,0),look.y,camDir);
	camDir = rotate(vec3(0,1,0),look.x,camDir);
	
	vec3 pos = camDir;;//\\ / (1.+(max(max(abs(camDir.x),abs(camDir.y)),abs(camDir.z))));
	
	col = swr(normalize(pos)+sin(time/pi));

	gl_FragColor = vec4( col, 1.0 );

}