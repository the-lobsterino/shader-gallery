#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 transform(vec2 p){
    p = p/resolution.xy*2.0 - 1.0;
    p.x *= resolution.x/resolution.y;
    return p;
}

vec2 project_point_on_line(vec2 p, vec2 a, vec2 b){
    vec2 ba = b - a;
    float u = dot(p - a, ba)/dot(ba, ba);
    u = clamp(u, 0.0, 1.0);
    return a + u*ba;
}

float line_dist(vec2 p, vec2 a, vec2 b){
    return distance(p, project_point_on_line(p, a, b));
}

float get_color_from_dist(float d){
    return smoothstep(0.2, 0.0, d);
}

void main(){
    vec2 p = transform(gl_FragCoord.xy);
    
    vec2 a = vec2(-1.0, +0.0);
    vec2 b = vec2(-0.0, -0.0);
    vec2 c = vec2(+1.0, +0.0);

    // trying to draw two smooth line segments (a, b) and (b, c)
    float color0 = get_color_from_dist(line_dist(p, a, b));
    float color1 = get_color_from_dist(line_dist(p, b, c));
    
    // too bright where line segments overlap
    float final_color = 1.0 - (1.0 - color0) * (1.0 - color1);
    // this helps a little, but not all overlap is subtracted
    //final_color -= get_color_from_dist(distance(p, b));
    
    // ugly seam
    //final_color = max(color0, color1);
   
    gl_FragColor = vec4(final_color);
} 
