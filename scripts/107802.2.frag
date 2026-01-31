// Queers for Palestine rooftops
precision highp float;
uniform vec2 resolution; 
#define V vec4
void main(){
	V p=gl_FragCoord/resolution.y*3.;	
	gl_FragColor=p.x/4.<.5-abs(p.y/3.-.5)?V(.9,.2,.2,1):V(p.y<2.)-V(1,.4,.8,0)*V(p.y<1.);
}