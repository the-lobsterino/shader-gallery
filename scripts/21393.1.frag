#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float egdesize=0.25*mouse.x;

float brick(vec2 p){
	p*=vec2(5.0,10.0);
	p.x+=0.5*mod(floor(p.y),2.0);
	p=abs(fract(p)-0.5);
	return max(0.0,step(egdesize,p.x)-step(0.5-2.0*egdesize,p.y));
}

void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p.x*=resolution.x/resolution.y;
	
	gl_FragColor=vec4(brick(p));
}