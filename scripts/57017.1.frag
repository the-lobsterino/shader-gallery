#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// hello world made from
// Leadlight by @hintz 2013-05-02

void main()
{
	vec2 position =(gl_FragCoord.xy -0.5 * resolution.xy)/ resolution.y ;

	
	float r = length(position);
	float a = atan(position.y, position.x);
	float t = time + mouse.x*20.0/(r+1.0);
	
	float light = 15.0*abs(0.05/(sin(t)+sin(a*4.0*mouse.y)));
	vec3 color = vec3(-sin(r*5.0-a-time+sin(r+t)), sin(r*3.0+a-cos(time)+sin(r+t)), cos(r+a*2.0+log(5.001-(a/4.0)))+sin(r+t));
	
	gl_FragColor = vec4((normalize(color)+0.5) * light , 1.0);
}