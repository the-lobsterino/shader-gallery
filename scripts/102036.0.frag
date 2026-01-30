#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphere(vec3 uv) {
    return length(uv) - 1.0; 
}

float scene(vec3 uv) {
    return sphere(uv);
}

void main( void ) {
    // UV
    vec2 uv =  (gl_FragCoord.xy * 2.0 - resolution) / resolution.y;
    
    // Camera
    vec3 camPos = vec3(0.0, 0.0, 2.0);
    
    //
    
    vec3 ray = normalize(vec3(uv, -1.0));
    
    bool hit = false;
    
    float curDist = 0.0;
    
    float rayLen = 0.0;
    
    vec3 rayPos = camPos;
    
    for (int i = 0; i <= 64; i++) {
        curDist = scene(rayPos);
        rayLen += curDist;
        
        rayPos = camPos + ray * rayLen;
        
        if(abs(curDist) < 0.001) {
            hit = true;
        }
    }    
    
    if (!hit) {
        // Output to screen
        gl_FragColor = vec4(vec3(0.3), 1.0);
    }
}