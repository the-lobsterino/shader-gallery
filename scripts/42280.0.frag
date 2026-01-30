/*
    Quadratic Through a Given Point Fragment Shader Example
*/

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

// HELPER FUNCTIONS
float plot(vec2 st, float pct){               
  return  smoothstep( pct-0.05, pct, st.y) -  
          smoothstep( pct, pct+0.00015, st.y);   
}


void main() {
    // noramlized values
    float a = mouse.x;
    float b = mouse.y;
	
    // Grab Coordinates
    vec2 st = gl_FragCoord.xy/resolution;
	
    // Quadratic Through a given Point =============	
    float A = (1.0-b)/(1.0-a) - (b/a);
    float B = (A*(a*a)-b)/a;
    float y = A*(st.x*st.x) - B*(st.x);
    y = min(1.0,max(0.0,y));
    // =============================================
    
    // Apply Results
    vec3 color = vec3(y);

    // Plot Line ===================================
    float pct = plot(st,y); 			  //
    color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);//
    // =============================================

    // Draw Smooth Step Function
    gl_FragColor = vec4(color,1.0);
}