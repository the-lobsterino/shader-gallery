#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float eli(vec2 st, mat3 e){
    st = (vec3(st,1) * e).xy;
    return 1.0-dot(st,st);
}



void main() {
    
    mat3 A = mat3(
    2,0.5,-1,
    1,3,-1,
    0,0,0);
	
    mat3 B = mat3(
    7,0,-5,
    0,7,-4,
    0,0,0);
	
    float t = abs(mod(time,2.0)-1.0);

    mat3 C = mat3(
    mix( A[0],B[0],t ),
    mix( A[1],B[1],t ),
    vec3(0)
    );


    gl_FragColor = vec4(vec3(eli(gl_FragCoord.xy/resolution.xy,C)),1.0);
}