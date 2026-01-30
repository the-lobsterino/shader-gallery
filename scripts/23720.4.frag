#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
#define PI 3.14159265359

float u_time = time; // adapted from http://patriciogonzalezvivo.com/2015/thebookofshaders/05/
vec2 u_mouse = mouse;
vec2 u_resolution = resolution;


// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) - 
          smoothstep( pct, pct+0.02, st.y);
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;

//    float y = st.x;
    float y = pow(st.x,5.75 + 5.0 * (1.07 * sin(5. * time)));

    vec3 color = vec3( y );
    
    // Plot a line
    float pct = plot(st,y);
    
    color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);
    
	gl_FragColor = vec4(color,1.0);
}