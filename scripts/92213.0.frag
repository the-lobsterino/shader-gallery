// first flower

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


const vec3 bgColor=vec3(0.6, 0.7, 1);

void main( void ) 
{
	vec2 p = gl_FragCoord.xy/resolution.xy -0.5;
	vec2 pp = (gl_FragCoord.xy  / resolution.xy) ;
	p.x *= resolution.x/resolution.y;	    

	float s = length(p) - 0.25;
	float ss = length(p) - 0.05;
	// step
	vec3 col = bgColor / smoothstep(-0.4, .90, pow(s,0.3));
	col = col * 1.0;
	vec3 col2 = bgColor / smoothstep(-0.4, .50, pow(ss,0.93));
	col2 = col2 * 1.0;
float l = (3.14*.05)*0.25 / length(vec2(mouse) - pp);
l += .05;
	
	gl_FragColor = vec4( l*col*col2, 25.0 );
}