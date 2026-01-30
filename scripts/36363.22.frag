#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define time 0.2*time*mouse.y/resolution.y

float axis(vec2 pos){
	float lineWidth = 0.001;
	vec2 absPos = abs(pos);
	return max(smoothstep(lineWidth, 0.0, absPos.x),smoothstep(lineWidth, 0.0, absPos.y));
}


float sqr(float a) {return pow(a, 2.0);}


void main( void ) {

	float mx = resolution.x;
	vec2 uv = ( (gl_FragCoord.xy)/ mx )-vec2(0.5, 0.5*resolution.y/ resolution.x) ;

	
	vec3 c = vec3(0.0);
	
	
	vec2 p = uv;
	vec2 s = vec2(0.,0.);
	float l = 0.125 + 0.125*sin(time);

	

	
	p -= s;
	p = vec2(p.x*cos(time) , p.y*sin(time));

	
	float ew = p.x + p.y;
	float ed = -(length(s-uv) - l);
	
	float e = length(vec2(ew,ed));
		e = min(-abs(ew),ed);
		//e = ew+ed;
	
	
	c.g = clamp(0.0,1.0,e);
	c.r = clamp(0.0,1.0,-e);
	float lineWidth = 0.005;
	
	c.b += sqr(smoothstep(lineWidth, 0.0, abs(e)));
	
	c.b += (smoothstep(lineWidth/4., 0.0, mod(e,0.01)))*abs(1.-e);
	c.b += (smoothstep(lineWidth/8., 0.0, mod(ed,0.01)))*abs(1.-ed);
	c.b += (smoothstep(lineWidth/8., 0.0, mod(ew,0.01)))*abs(1.-ew);
	c += smoothstep(lineWidth/4., 0.0, abs(ed));
	c += smoothstep(lineWidth/4., 0.0, abs(ew));
	
	//c += axis(uv); 
	//c += axis(uv-s)*length(uv-s); 

	gl_FragColor = vec4( c, 1.0 );

}