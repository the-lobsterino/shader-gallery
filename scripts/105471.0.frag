#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
vec2 u;

void main(void)
{
  
    gl_FragColor=vec4(vec3(
	    step(
		    fract(
			    (mod(
				    floor(
					    (u=(gl_FragCoord.xy+gl_FragCoord.xy-resolution)/resolution.y).x/.3+.8*time)+floor(
					    	u.y/.3+.8*time), 4.)>1.?u.x:u.y)/.3),.5)),1);
	
}  