// no lame tags to be found in this shader

// INDEED ! .. this is USEFUL .. this is CONTRIBUTING .. this is BENEVOLENT
// no need to sift through code and separate the ' GRAFFITI ' from the ' ART '

// MODS BY NRLABS 2016 - I have to agree that the shaders are far more educational without tags
// if you make some changes then put a comment in the code like I do, not in the shader
// and if you *are* trying to take credit for someone else's work, that is pretty low class



#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

float velocity = 1.27;		// controls speed and direction, negative numbers move backwards
float rotationSpeed = 0.5;	// controls speed and direction, negative numbers rotate clockwise


#define q(a,b,c) (abs(fract(a/b)-.5)-c*.5)*b
#define u resolution

void main()
{
	vec3 p=vec3(cos(time*rotationSpeed),sin(time*rotationSpeed),time*velocity);
	for(float i=0.;i<1.;i+=.01)
	{
		float r=length(p.xy),
		      d=.41+.4*cos(time/4.),
		      e=min(max(q(r,1.,.2),max(q(p.z,1.,d),q((atan(p.x,p.y)+time*.3*cos(floor(r/2.))*sin(floor(p.z)*13.73))*r,(acos(.75)*r*time*0.02),d))),.25),
		      s=3.*i*i-2.*i*i*i-i;
		p+=e*normalize(vec3((2.*gl_FragCoord.xy-u)/(max(u.x,u.y)*mouse.x*3.),1));
		gl_FragColor=vec4(s,i*(i-1.),-2.*s,1)*2.+i;
		if(e<.0001)break;
	}
}
