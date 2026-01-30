// https://www.shadertoy.com/view/dsXXzH

#extension GL_OES_standard_derivatives : enable

precision highp float;
uniform float time;
uniform vec2 resolution;

// https://www.shadertoy.com/view/dsXXzH

void main()
{
    float t = fract(time*0.1)*6.28;
    vec2 p = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
    p.y *= 4.0;
  	p.y *= sin(p.x * 25.0 )+ 0.5 * sin(p.x*p.y * 4.0 + t*4.0 );
    p.y = pow(abs(p.y*1.3+p.x*0.8),12.0);
    float v = clamp(p.y , 0.0, 1.0);
    gl_FragColor = vec4(v*0.37,v*0.45,v*0.64,1.0);
}

