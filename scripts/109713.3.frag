// https://www.shadertoy.com/view/7d2BDd
precision mediump float;
uniform float time;
uniform vec2 mouse, resolution;

vec2 triangle_wave(vec2 a,float scale){ return abs(fract((a+vec2(1,.5))*scale)-.5);}

void main()
{
    const float t1=15000., scale=1.5;
    vec3 c=vec3(0);
    vec2 uv = gl_FragCoord.xy/resolution.y/t1/2.;
    uv -= vec2(5,3)*mouse/t1/2.;
    float p1=1.;
    
    for(int i=0;i<9;i++)
    {
        vec2 t2=vec2(0), t3=t2;
        for(int k=0; k<3; k++){           
            uv = -(uv+t2.yx)/1.35-ceil((t2.x+p1)*10.-1.)/20.+1.0673; //rose gardens
            t2 = p1*triangle_wave(uv.yx-.5-mod(floor(t2.x),2.),1.5);
            t3 = -p1*triangle_wave(uv,1.5);
            uv.yx = (t2+t3)/scale;
            p1 *= -1.;
        }
        float s1 = 1.9-uv.y*4.;
        c.x = min(uv.y+uv.x+c.x,c.x*s1);
        c = abs(c.yzx/s1-c.x);
    }
    gl_FragColor =  vec4(c*2.,1);
}