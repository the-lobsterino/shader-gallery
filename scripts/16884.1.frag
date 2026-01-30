//xL
#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float asp = resolution.y/resolution.x;
float ti = time/3.;
float tim = time/.6;
 
void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy )*vec2(1.,asp)*(2.0,2.0)-vec2(1.0,asp);
	vec2 m = (p);
	vec2 col = (p);
	vec2 coR = (p);
	vec2 coG = (p);
	vec2 coB = (p);
	
	float pol_ang = atan( p.y,p.x);
	float pol_r = sqrt(p.x*p.x + p.y*p.y);
	
	m.x = sin(p.x*8.0);
	m.y = sin(p.y*6.0);
	col.x = abs(sin(pol_ang*1.))*abs(sin(pol_r*3.-tim))*0.8;
	col.y = abs(sin(pol_r*5.)*sin(pol_ang*1.+ti))*0.8;
	
	coR.x = abs(sin(pol_ang*2.))*abs(sin(pol_r*4.-tim))*0.8;
	coR.y = abs(sin(pol_r*58.)*sin(pol_ang*1.+ti))*0.8;
	
	coG.x = abs(sin(pol_ang*1.))*abs(sin(pol_r*3.-tim+1.))*0.8;
	coG.y = abs(sin(pol_r*58.)*sin(pol_ang*1.+ti+1.))*0.8;
	
	coB.x = abs(sin(pol_ang*1.))*abs(sin(pol_r*3.-tim+.5))*0.8;
	coB.y = abs(sin(pol_r*4.)*sin(pol_ang*1.+ti+.5))*0.8;
	
	
	//col.y = 1.-smoothstep(.5,.7, col.y);
	
	float red = (smoothstep(.5,.8, coR.y)-smoothstep(.5,.8, coR.x))*1.5;
	float green = (smoothstep(.3,.9, coG.y)-smoothstep(.3,.9, coG.x))*1.5;
	float blue = (smoothstep(.1,.7, coB.y)-smoothstep(.1,.7, coB.x))*1.5;
	
	gl_FragColor = vec4(red,green,blue,1.0);
}
