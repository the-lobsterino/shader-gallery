// razor 1911 logo become fx, gtr
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
// quick triangle (function) thanx to the author;

vec3 triangle(vec2 uv,float ang,float zoom,float smooo,vec3 c)
		
{
	 
	float l = length(uv);
	float a = ang-atan(uv.x, uv.y);
	float m = (200.28 / 3.)/1.0; // div
	a = mod(a + m / 2., m) - m / 2.;
	float d =min(1.10+sin(time),1.45)*8.*abs(l * cos(a) - zoom);  // dist
 			      // smooth
	c = vec3(smoothstep(.04, smooo, d));
	return  c ;
	
}

void main() {
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	float t = time;
	     // t = 0.0;
	vec3 col = vec3(0.0);
	
	for (float i=0.0;i<45.0;i++){  // num
	
	        col  +=   triangle(uv-vec2(0.0,-0.2),1.05+sin(t+i*0.1),i/50.,0.030,vec3(1.0));
	        
	
	} 
	gl_FragColor = vec4(col.r*sin(uv.y+uv.x+time),sin(uv.x*col.g),col.b, 1.); /// todo !!
}
// seems ok !!