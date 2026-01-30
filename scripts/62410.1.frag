// - glslfan.com --------------------------------------------------------------
// Ctrl + s or Command + s: compile shader
// Ctrl + m or Command + m: toggle visibility for codepane
// ----------------------------------------------------------------------------
precision mediump float;
uniform vec2  resolution;     // resolution (width, height)
uniform vec2  mouse;          // mouse      (0.0 ~ 1.0)
uniform float time;           // time       (1second == 1.0)
uniform sampler2D backbuffer; // previous scene

const float PI = 3.1415926;



void main(){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x,resolution.y);
    
    float r = 0.3/length(p-vec2(clamp(abs(1.9*cos(1.5*time))-1.0,0.0,1.0),0));
    float g = 0.3/length(p-vec2(-clamp(abs(1.9*sin(1.5*time))-1.0,0.0,1.0),0));
    gl_FragColor = vec4(r,g,1.0, 1.0);
}
