#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

#define PI 3.14159265359

float random(vec2 st, float d){
    return pow((fract( sin( d * time * st.x / st.y) ) * clamp( cos ( time + 1.0 ), 0.1, .01)), 0.95);
}

float circle(vec2 st){
    float outR = 0.4;
    float inR = 0.35;
    
    outR -= random(st, outR);
    
    vec2 centre = vec2(0.6, 0.5);
    
    float d = distance(centre, st);
    
    if ( d < outR && d > inR ) {
        return 0.0;
    }
    else{
        return 1.0;
    }
}

mat2 getMat(float angle){
    return mat2(cos(angle), -sin(angle),
		sin(angle),  cos(angle));
}

void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy;
    st.x *= resolution.x / resolution.y;

    st -= vec2(0.5);
    st = st * getMat(sin(time) + PI * 0.5);
    st += vec2(0.5);
    
    vec3 color = vec3(circle(st));
    
    gl_FragColor = vec4(color, 1.0);
}