
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
vec3 color = vec3(10);
float f = 01.;

void main(){
    	vec2 pos = (gl_FragCoord.xy - .5 * resolution.xy) / resolution.y;;
    	float r = length(pos)*.5;
    	float a = atan(pos.y, pos.x);
     
	(sin(a*3.+time));
	f = smoothstep(-.5,1., cos(a*13.+time*4.))*1.+0.0;

    	color = vec3( 1.-smoothstep(f,f+.00,r) );
    	gl_FragColor = vec4(color, 1.0);
}