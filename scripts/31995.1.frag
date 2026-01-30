#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

uniform sampler2D tex;

#define PI 3.1415

#define amp 0.9
#define f 0.15
#define r 2.0
#define phi 75.0* PI/180.0

float traj(vec2 pos)
{
vec2 p = vec2(amp*1.5*cos(f*2.0*PI*time),amp*cos(f*r*2.0*PI*time+phi));
	
	return dot(pos-p,pos-p);
	
	
}


void main( void ) {

	vec2 position = ( (gl_FragCoord.xy - resolution/2.0)/ (resolution.xy /2.0));
	position.x *= resolution.x/resolution.y;

	vec3 color = vec3(0.0,0.0,0.0);
	float i = traj(position);
	
	i = clamp(pow(abs(i),0.2),0.0,1.0);
	i = smoothstep(0.0,1.0,pow(1.0-i,6.0));
	color.x = i;
	vec3 texcol = texture2D(tex,gl_FragCoord.xy/resolution).xyz;
color = color + texcol/(clamp(cos(time/2.0)*cos(time/2.0)-0.97,0.0,0.03)+1.015);
	gl_FragColor = vec4( color, 1.0 );

}