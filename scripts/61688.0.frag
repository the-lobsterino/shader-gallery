// Necip's studies... 
// Learning today about fraction
// https://thebookofshaders.com/glossary/?search=fract
// Example: https://www.youtube.com/watch?v=cQXAbndD5CQ
//


#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 uv = surfacePosition;
  	uv += 0.5;
	
	vec3 col = vec3(0);
	vec2 gv = fract( uv*5.);

	// col.rg = gv;
	
		
	vec2 translate = vec2(-0.5, -0.5);
	gv += translate;
	
	for(int i = 2; i < 50; i++){
	    float radius = 0.4;
	    float rad = radians(260.0 / 11.0) * float(i);
	
	    col += 0.003 / length(gv + vec2(radius * cos(0.01*time*rad), radius * sin(0.01*time*rad)));
	}
	
	
	gl_FragColor = vec4( col, 1.0);

}