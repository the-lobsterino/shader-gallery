#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

const int   complexity      = 300;
const float fluid_speed     = .1;
const float color_intensity = 1.0;
uniform sampler2D sTexture;

void main()
{

    vec2 p=(2.0*gl_FragCoord.xy-resolution)/max(resolution.xy,resolution.yx);
    for(int i=155;i<complexity;i++) {
        vec2 newp=p;
        newp.x+=-.15/float(i)*sin(float(i)*p.y+time*0.01/fluid_speed*float(i))+14400.0;
        newp.y-=0.5/float(i)*sin(float(i)*p.x+time*0.01/fluid_speed+4444.0*float(i+10))-100.0;
        p=newp;
    }

    vec3 col=vec3(color_intensity*sin(15.0-p.x/p.y*color_intensity*p.x)*color_intensity + 0.5,color_intensity*sin(15.0*p.y)+color_intensity + 0.5,sin(p.x+p.y) + 2.);

    gl_FragColor=vec4(col, 3.0);
    gl_FragColor = vec4(gl_FragColor.xyz, 1.);
}