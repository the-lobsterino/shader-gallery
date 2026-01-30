#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float it =  100.0;

void main( void ) {
	float mx = max(resolution.x, resolution.y);
	vec2 scrs = resolution/mx;
	vec2 uv = gl_FragCoord.xy/mx;
	uv -= scrs/2.0;
	vec2 m = vec2(mouse.x/scrs.x,mouse.y*(scrs.y/scrs.x))*50.0;
	
	float v = it;
	
	vec3 spacing = vec3(6.0, 6.0, 6.0*length(uv));
	
	for (float i = 0.0; i < it; i++)
	{
		v--;
		if(floor(mod(uv.x*spacing.z*v+m.x, spacing.x))==1.0 && floor(mod(uv.y*spacing.z*v+m.y, spacing.y)) == 1.0){
			
			gl_FragColor = vec4(i/it*(sin(i/5.0-time*5.0+2.0*PI/3.0)+1.0)/2.0,
					    i/it*(sin(i/5.0-time*5.0+4.0*PI/3.0)+1.0)/2.0,
					    i/it*(sin(i/5.0-time*5.0+6.0*PI/3.0)+1.0)/2.0,
					    1.0);
		}
		
	}

}