#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0;
	p.x *= resolution.x/resolution.y;
	vec3 col = vec3(0); 
	
	float ang = time*0.1;
	//p = vec2(p.x*cos(ang)-p.y*sin(ang),p.x*sin(ang)+p.y*cos(ang)); 
	vec2 op = p;//*sin(time*0.1); 
	for (int i = 0; i < 100; i++) {
		
		p = op; 
	p.x = mod(p.x+2.0+0.25*time, 4.0)-2.0;
	p.y = -abs(p.y)+0.8;
	float k = float(i)+time*10.0; 
	float d = abs(p.y+0.5*smoothstep(0.0,1.0,p.x-mouse.x*0.0+0.0)-0.5*smoothstep(0.0,1.0,p.x+2.0));
	col += vec3(sin(k),sin(k+2.0),sin(k+3.0))*6.0/(1.0+300.0*d)/(1.0+0.05*float(i));
	//if (d < 0.005) col += vec3(1)/(1.0+0.3*float(i)); 
	op *= 1.05;	
	float ang = 0.05; 
	op = vec2(op.x*cos(ang)-op.y*sin(ang),op.x*sin(ang)+op.y*cos(ang)); 
	}
	col *= 0.3;
	gl_FragColor = vec4(col, 1.0); 
}