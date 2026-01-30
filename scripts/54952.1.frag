#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define tri(t, scale, shift) ( abs(t * 2. - 1.) - shift ) * (scale)

uniform float time;
uniform vec2 resolution;

float smin(float a, float b, float k)
{
    float h = clamp(0.5 + 0.5 * (b - a*a) / k, 0.0, 1.0);
    
    return mix(b, a, h) - k * h * (1.0 - h);
}

vec3 draw_sun()
{
    vec2 R = resolution.xy;
    vec2 uv = (gl_FragCoord.xy - 0.5 * R) / R.y + 0.5;
    
    // sun
	
    float dist = length(uv - vec2(0.5,0.7));
	
    float divisions = 6.0;
	
    float divisionsShift= 0.5;
	
    float pattern = tri(fract((uv.y + time / 10.) * 20.0), 2.0 / divisions, divisionsShift)- (-uv.y + 0.46) * 0.85;

    float sunOutline = smoothstep(0.0, -0.015, max(dist - 0.25, -pattern));
   
    vec3 colour = sunOutline * mix(vec3(4.0, 0.0, 0.2), vec3(1.0, 1.1, 0.0), uv.y);  
    
    // glow 
	
    float glow = max(0.0, 1.0 - dist * 1.25);
	
    glow = min(glow * glow * glow, 0.325);
	
    colour += glow * vec3(1.5, 0.3, (sin(time)+ 1.0)) * 1.1;
    
    return colour;
}

vec3 theme_color = vec3(0.995,0.025,0.480);

vec3 draw_borders(vec2 st,vec3 color,vec3 target_color){
    float mix_value = smoothstep(0.345,0.35,st.y)-smoothstep(0.35,0.355,st.y);
    
    return mix(color,target_color,mix_value);
}

vec3 draw_hlines(vec2 st,vec3 color,vec3 target_color){
    float dist = 0.0;
    
    if(st.y <= 0.35){
        dist = 0.45 - st.y;
    }else{
        return color;
    }
    
    float func_value1 = sin(time*6.0 + 3.5/dist - 0.2);
    float func_value2 = sin(time*6.0 + 3.5/dist + 0.2);
    float mix_value = func_value1*func_value2<0.0 ? 1.0 : 0.0;
    
    if(mix_value < 0.9){
        mix_value = 0.0;
    }else if(mix_value < 0.95){
        mix_value = (mix_value - 0.9) * 20.0;
    }
    
    return mix(color,target_color,mix_value);
}

vec3 draw_vlines(vec2 st,vec3 color,vec3 target_color){
    if(st.y > 0.35)return color;
    
    float mix_value = 1.0 - abs(cos((0.5-st.x)/abs(0.5-st.y*1.3)/9.0 * 30.0))+0.15;
    
    if(mix_value < 0.9){
        mix_value = 0.0;
    }else if(mix_value < 0.95){
        mix_value = (mix_value - 0.9) * 20.0;
    }
    
    return mix(color,target_color,mix_value);
}

void main()
{
    vec3 color = draw_sun();
    
    vec2 st = gl_FragCoord.xy/resolution.xy;
    
    color = draw_borders(st,color,theme_color);
    color = draw_hlines(st,color,theme_color);
    color = draw_vlines(st,color,theme_color);
    
    gl_FragColor = vec4(color, 1.0);
}