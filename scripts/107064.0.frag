precision mediump float;
uniform float time;
uniform vec2  resolution;

float sdHexagon( in vec2 p, in float r )
{
    const vec3 k = vec3(-0.866025404,0.5,0.577350269);
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p);
}

void main(void){
    vec2 p = (gl_FragCoord.xy * 4. - resolution) / min(resolution.x, resolution.y);
    p *= sin(time/5.0) * mat2(cos(time)*p.x,sin(time)*p.y,-sin(time)*p.y,cos(time)*p.x);
    p = mod(p,0.05) - 0.025;
    float l = 0.0;
    float q = sdHexagon(p,0.01);
    l += 0.0002/q;
    gl_FragColor = vec4(vec3(l*2.0*sin(time),l*cos(time*2.0),l*8.0*cos(time)), 1.0);
}