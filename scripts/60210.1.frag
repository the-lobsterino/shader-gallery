// jizzup
#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float PI = 3.141592653589793238462;
#define clamps(x) clamp(x,0.,1.)
vec2 rotation(in float angle,in vec2 position)
{
    float rot = radians(angle*360.);
    mat2 rotation = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
    return vec2(position*rotation);
}
#define PATTERN_NUM 3.
float pattern(vec2 uv) {
	float zoom = 0.01;
	float shrp = 700.;
	float size = 0.2;
	vec2 uv2 = fract((uv/2.)/zoom);
	uv = fract(uv/zoom);
	if (PATTERN_NUM == 0.) { //Dots
		return 1.-clamps((length(uv-.5)-size)*(shrp*zoom));
	}
	if (PATTERN_NUM == 1.) { //Triangles
		return clamps((mix(((uv.x*2.)-1.)+uv.y,((1.-(uv.x*2.)))+uv.y,step(uv.x,0.5))-1.)*(shrp*zoom));
	}
	if (PATTERN_NUM == 2.) { //Triangles 2
		uv = fract(vec2(uv.x+(floor(uv2.y*2.)*.5),uv.y));
		return clamps((mix(((uv.x*2.)-1.)+uv.y,((1.-(uv.x*2.)))+uv.y,step(uv.x,0.5))-1.)*(shrp*zoom));
	}
	if (PATTERN_NUM == 3.) { //***
		uv = fract(vec2(uv.x+(floor(uv2.y*2.)*.5),uv.y));
		
		vec2 pos = vec2(0.5)-uv;

  		  float r = length(pos)*2.0;
		 
   		 float a = atan(pos.y,pos.x)+time*0.32;

	    	 float f = sin(a*6.);
		
		 
		
		return clamps((mix(((uv.x)-1.) ,(( (uv.x))) ,1.-smoothstep(f,f+0.02,r)))*(shrp*zoom));
		
		
		//return  clamps( 1.-smoothstep(f,f+0.02,r))*(shrp*zoom);
	}
	
}
void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	vec2 suv = vec2(((uv.x-0.5)*(resolution.x / resolution.y))+0.5,uv.y)-.5;
	
	float rotate = time*0.003;
	float zoom = .0324;
	vec2 offset = vec2(0.5,0.);
	
	float color = pattern(suv);
	color += pattern(rotation(rotate,(suv*zoom)+offset));
	
	color = clamps(color);
	
	gl_FragColor = vec4(mix(vec3(0.6,.5,0.5),vec3(0.3,0.1,0.),color), 1.0 );

}