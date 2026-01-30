
#ifdef GL_ES
precision highp float;
#endif

// MODS BY NRLABS 2016 

#define PI 3.14159265359

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.27, pct, st.y) - 
          smoothstep( pct, pct+0.27, st.y);
}

float scale = 0.0; // 0.0 .. 100.0
float speedHz = 0.0;
float speedVt = 10.0;

vec3 color = vec3(0.0,0.0,0.5);

void main() {
    
    vec2 st = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
    st.x *= resolution.x / resolution.y;

    st *= 21.0 - ( 20.0 / 100.0) * scale;
	
    float y = sin(st.y + time * speedVt) * sin(st.x + time * speedHz) * 20.0;

    float pct = plot(st,y)*10.0;
    color = (1.00-pct)*color+pct*vec3(1.0,1.0,1.0);
    
    gl_FragColor = vec4(color,1.0);
}