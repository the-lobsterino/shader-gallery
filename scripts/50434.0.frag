#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

vec3 drawRectangle(in vec2 st) {
    // Each result will return 1.0 (white) or 0.0 (
	    vec3 color = vec3(0.0);
	vec2 borders = step(vec2(0.8),st); 
    	float pct = borders.x * borders.y;
	
	    // top-right 
     vec2 tr = step(vec2(0.1),1.0-st);
     pct *= tr.x * tr.y;
    // The multiplication of left*bottom will be similar to the logical AND.
    color = vec3(pct); 
	return color;
}	

void main(){
    vec2 st = gl_FragCoord.xy/resolution.xy;
	vec3 asd = vec3(0.0);
	asd  = drawRectangle(st);
    gl_FragColor = vec4(asd,1.0);
}
