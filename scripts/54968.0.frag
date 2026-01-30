#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

vec3 theme_color = vec3(0.95,0.95,0.00)*2.;
vec3 sky_color = vec3(0.0,0.4,0.60);

vec3 draw_borders(vec2 st,vec3 color,vec3 target_color){
    float mix_value =     smoothstep(0.50,1.5,st.y);
    
    return mix(color,target_color,mix_value);
}

vec3 draw_hlines(vec2 st,vec3 color,vec3 target_color){
    float dist = 0.0;
    if(st.y >= 0.50){
       // dist = st.y - 0.6;
	     return color*4.;
    }else if(st.y <= 0.80){
        dist = 0.60 - st.y;
    }else{
        return color;
    }
    
    float mix_value = 1.2 - abs(cos(time*15.0 + 3.5/dist));
    
    
    
    return mix(color,target_color,mix_value);
}

 
void main(void) {
    vec2 st = gl_FragCoord.xy/resolution.xy;

    vec3 color = vec3(0.0);
    color = draw_borders(st,color,sky_color);
    color = draw_hlines(st,color,theme_color);
    

    gl_FragColor = vec4(color,1.0);
}