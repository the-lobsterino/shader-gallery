// gtr //2008
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float cr (vec2 p,vec2 pos,float size){
	
	float d = length(p-pos);
	
	float r=0.3,b=0.01;
	
	d = smoothstep(r,r+b,d*size);
	
   return d;	
}



void main( void ) {

	vec2 p = (2.* gl_FragCoord.xy - resolution) /   resolution.y;
	 
	
	float t = time*2.0, s = sin(t), c = cos(t);
	mat2 rot = mat2(c,-s,s,c); // rot2d
	
	p *= rot;
	
	 
	//              p : pos( x,  y) ,    size 
	float col =  cr(p,vec2(-.4,-0.15),1.0+sin(t+p.x*100.)+1.0-0.1);
	      col *= cr(p,vec2(0.3,-0.15),1.0+sin(t+p.y*100.)+1.0-0.1); 
	      col *= cr(p,vec2(-.05,0.40),1.0+sin(t-length(p)*100.)+1.0-0.1);

	gl_FragColor = vec4( 1.-vec3(0.8*col,0.5*col,0.1*col), 1.0 );

}