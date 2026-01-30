#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359

//VARIABLES!
// Check out this page for more cool functions: http://www.iquilezles.org/www/articles/functions/functions.htm

// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

void main() {
	vec2 position = gl_FragCoord.xy/resolution;
	float y;
	
	
	//FUNCTION TO PLOT
	
	y = position.x;
	
	//y = pow( position.x, 2.0);
	
	//y = step(0.5,position.x); // Definition: float step(float edge, float x)  
	
	//y = smoothstep(0.1,0.9,position.x); // Interpolation Between 2 Values: float smoothstep(float edge0, float edge1, float x)  
	
	//y = sin( position.x * PI);
	//y = tan( position.x);
	
	

	
	vec3 color = vec3(y);
	// Plot a line
	float pct = plot(position,y);
	color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);

	gl_FragColor = vec4(vec2(1, 0)-position, 0,1.0);
}