

precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

void main(void){
    vec2 m = vec2(mouse.x * 2.0 - 1.0, -mouse.y * 2.0 + 1.0);
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
		
    
    
	// flower
float u = cos(sin((atan(p.y, p.x) + time *1.0)*10.0 ));
float t = 0.051 / abs(u - length(p));
    gl_FragColor = vec4(t,cos(time*0.05),sin(time), 1.0);
}