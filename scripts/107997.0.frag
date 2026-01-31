#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

#define R iResolution.xy

float Cir (vec2 uv, float r, bool blur) {
    float a = blur ? 0.01 : 0.;
    float b = blur ? 0.13 : 5./R.y;
    return smoothstep(a, b, length(uv)-r);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = (fragCoord-.5*R.xy)/R.y;
    vec2 t = vec2(sin(iTime*2.), cos(iTime*2.+cos(iTime*.1)))*.1;
    
    // Change colors to gradient
    vec3 Col1 = mix(vec3(0.1, uv.y*2., 0.4+uv.x*-1.1), vec3(0.2078, 0.0157, 0.2353), uv.y);
    vec3 Col2 = vec3(.97);
    
    float cir1 = Cir(uv-t, .2, true);
    float cir2 = Cir(uv+t, .2, false);
    float cir2B = Cir(uv+t, .3, true);
    
    // Decrease the alpha of the white sphere by half
    vec4 Col0 = vec4(vec3(0.0588, 0.0824, 0.2353), 0.5);

    vec3 col = mix(Col1+vec3(.2,.1,1.), Col2, cir2B);
    col = mix(col, Col0.rgb, cir1);
    col = mix(col, Col1, clamp(cir1-cir2, 0., 3.));
    fragColor = vec4(col, 1.0);
}

void main(void) {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
