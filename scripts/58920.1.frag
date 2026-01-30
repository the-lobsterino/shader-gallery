// original https://www.shadertoy.com/view/tdGXWm

precision highp float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define PI 3.14159

float VDrop2(vec2 uv)
{
    uv.x *= sin(1.+uv.y*.125)*0.5;			// ADJUST PERSP
    float t =  time*0.4;
    uv.x = uv.x*27.0;					// H-Count
    float dx = fract(uv.x);
    uv.x = floor(uv.x);
    uv.y *= 0.27;					// stretch
    float o=sin(uv.x*215.4);				// offset
    float s=cos(uv.x*33.1)*.3 +.7;			// speed
    float trail = mix(145.0,15.0,s);			// trail length
    float yv = 1.0/(fract(uv.y + t*s + o) * trail);
    yv = smoothstep(0.0,1.0,yv*yv);
    yv = sin(yv*PI)*(s*5.0);
    float d = sin(dx*PI);
    return yv*(d*d);
}

void main(void)
{ 
 vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
 vec3 col = vec3(1.,.6,.2)*VDrop2(uv);
 gl_FragColor=max(vec4(col,1.), texture2D(backbuffer, gl_FragCoord.xy/resolution)-1./resolution.y*0.5);
}