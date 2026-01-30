#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
    float iTime = time;
    vec2 pos = vec2(0.0,0.0);
    float speed = 1.5;
    float size = 0.1;
    float ratio = resolution.x/resolution.y;
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy/resolution.xy;
    uv.x*=ratio;
    pos.x=ratio*((1.0/ratio)*size+abs(1.0-2.0*(1.0/ratio)*size-mod(-iTime*speed*(1.0/ratio),2.0*(1.0-2.0*(1.0/ratio)*size))));
    pos.y=size+abs(1.0-2.0*size-mod(5.0-iTime*speed,2.0*(1.0-2.0*size)));
    
    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
    
    float dis = step(size,length(pos-uv));

    // Output to screen
    gl_FragColor = vec4(col,1.0)*dis*0.5;
}