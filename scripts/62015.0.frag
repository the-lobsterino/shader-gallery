
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;


void ellipse(vec2 p, vec2 offset, vec2 prop, float size, vec4 color, inout vec4 i){
	vec2 q = ( p - offset ) / prop;
	if ( length(q) < size){
		i = color;
	}
}

void Box(vec2 p, vec2 offset, vec2 size, vec4 color, inout vec4 i){
	vec2 q =(( p - offset) / size)+vec2(-0.3,6.6);
	if(abs(q.x) < 1.0 && abs(q.y) < 1.0){
		i = color;
	}
}

void wing(vec2 p, vec2 offset,vec4 color, inout vec4 i){
	vec2 q = p-offset+vec2(-0.58,-0.1);
	if(abs(q.x+q.y) < 0.2 && abs(q.x - q.y) <0.3 && q.x<0.0 && q.y > 0.0){
		i = color;
	}
}
		
void main( void ) {
	float t = time;
	vec2 r = resolution;
	
	vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x,r.y);
	vec4 destcolor = vec4(mod(sin(0.05*t*p.x),0.8),mod(cos(0.5*t*p.x),0.4)-mod(sin(0.04*t),0.2),0.5,0.5);
	vec2 offset = vec2((-6.0)*((0.1*t-ceil(0.1*t))+0.6),0.0);
	
	
	Box(p,offset, vec2(0.2,0.05),vec4(0.2,0.2,0.5,0.5),destcolor);
	wing(p,offset,vec4(0.5,0.6,0.5,0.2),destcolor);
	ellipse(p,offset, vec2(1.0,0.5), 0.6, vec4(0.2,0.4,0.5,1.0),destcolor);
	
	gl_FragColor = vec4(destcolor);
	

	
}