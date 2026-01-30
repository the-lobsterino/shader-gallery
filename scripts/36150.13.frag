// Author: Pirlhoff
// Title: starnAzss

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main() {
    

    vec2 mousest = mouse/resolution;
	    vec2 st = (gl_FragCoord.xy/resolution.xy) + sin(mouse+5.0);
	
	
	
    float PI = 3.141592653589793238462643383279;
    
    st.x *= resolution.x/resolution.y;
    
    float r = abs(sin(time/PI - st.y));
    float g = (sin(time)+1.0)/2.0;
    float b = 0.5*sin(time);
    
    st += vec2(.0);
    vec3 color = vec3(1.);
    color = vec3(r,g,b);
    vec3 roloc = vec3(g,b,r);
	
    vec3 ciccio = mix(color*cos(time), roloc+st.y*sin(time), abs(log(sin(1.0-log(time*(st.y/st.x)+sin(time*st.x*st.y)))*abs(sin(time+st.y)))));
	
	
    gl_FragColor = vec4(ciccio,1.0);
}
