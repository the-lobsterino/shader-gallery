#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//
// cellular noize
// https://thebookofshaders.com/12/?lan=jp
//

vec2 pointA = vec2(0.6,0.3);
vec2 pointB = vec2(-0.2,0.7);
vec2 pointC = vec2(-0.8,-0.2);
vec2 pointD = vec2(0.5,-0.6);


vec3 image(vec2 st)
{
	vec2 point[5];
	point[0] = pointA * sin(time * 11.43) * 0.53;
	point[1] = pointB * sin(-time * 88.85) * 0.63;
	point[2] = pointC * cos(time * -8.32 + cos(time*0.84)) * 0.73;
	point[3] = pointD * sin(time*7.52) * cos(time * 0.21);
	point[4] = vec2(0.6) * sin(time * 8.3 + cos(time * 8.34));	

	float minDist = 1.0;
	for(int i = 0;i < 5;++i)
	{
		minDist = min(minDist,distance(st,point[i]));
	}
	
	vec3 color = vec3(0.0);
	color += minDist;
	return color;
}

void main( void ) {

	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x,resolution.y);
	
	gl_FragColor = vec4(image(pos),1.0);
}