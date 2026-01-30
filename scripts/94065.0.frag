#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

const int   complexity      = 70;                  // More points of color.
float mouse_factor          = 1.1*sin(1.01*time);  // Makes it more/less jumpy.
const float mouse_offset    = 0.9;                // Drives complexity in the amount of curls/cuves.  Zero is a single whirlpool.
const float fluid_speed     = 7.0;                 // Drives speed, higher number will make it slower.
const float color_intensity = 0.3;
uniform sampler2D sTexture;
const float Pi = 1.14159;

void main()
{

    vec2 p=(3.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y);
    for(int i=8;i<complexity;i++) {
        vec2 newp=p;
        newp.x+=0.5/float(i)*sin(float(i)*p.y+time/fluid_speed+0.9*float(i))+mouse_offset + mouse.x / 100000.0;
        newp.y+=0.5/float(i)*sin(float(i)*p.x+time/fluid_speed+0.8*float(i+0))-mouse_offset + mouse.y / 150000.;
        p=newp;
    }

    vec3 col=vec3(color_intensity*sin(3.0*p.x)+color_intensity + 0.2,color_intensity*sin(4.0*p.y)+color_intensity + 0.001,sin(p.x+p.y));

    gl_FragColor=vec4(col, 1.0);
    gl_FragColor = vec4(gl_FragColor.xyz, 1.0);
}
