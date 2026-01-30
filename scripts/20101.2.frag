#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

const float mg_fallOffDistance = 0.4;
const float mg_brightness = 2.5;

void main( void ) {
	// mouse glow effect
	float mg_distance = length(mouse - (gl_FragCoord.xy / resolution.xy));
	float mg_intensity;
	
	if(mg_distance <= mg_fallOffDistance)
		mg_intensity = (mg_fallOffDistance - mg_distance)* mg_brightness;
	else
		mg_intensity = 0.0;
	
	//mg_intensity = max((mg_fallOffDistance - mg_distance)* mg_brightness,0);
	vec3 mg_effectColor = vec3(mg_intensity);
	
	// background shade
	//vec3 bs_shadeEffect = vec3( 0,0,1);
	//vec3 bs_effectColor = bs_shadeEffect*vec3( 0.5,0.5,.5);
	vec2 p=surfacePosition*.2+0.1;
	float bTime = time / 4.0;
	//(2.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y);
	for(int i=1;i<50;i++)
	{
		vec2 newp=p;
		newp.x+=0.6/float(i)*sin(float(i)*p.y+bTime*0.5+0.3*float(i))+1.0;
		newp.y+=0.6/float(i)*sin(float(i)*p.x+bTime*0.45+0.3*float(i+10))-1.4;
		p=newp;
	}
	vec3 col=vec3(0.5*sin(3.0*p.x)+0.5,0.5*sin(3.0*p.y)+0.5,sin(p.x+p.y));
	
	// Set the output color for the current pixel. 	
	gl_FragColor = vec4( mg_effectColor*col, 1.0); 
}