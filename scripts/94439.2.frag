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
	p.x += sin(p.x*1.1+p.y*2.4+time*0.4)*0.15;
	
    float bv = 1.2-abs(p.y*1.85);
	p+=length(p*.95)-0.1;
    p.y = 1.35 * sin(p.y*18.0+p.x * 5.5 )+ 0.5 * sin(p.x * 5.0 + t*2.0 );
    p.y = pow(abs(length(p*0.4)+p.y*1.7+p.x*0.8),0.75);
    float v = clamp(p.y , 0.0, 2.2)*abs(bv);
    gl_FragColor = vec4(v*.88,v*0.575,v*0.43,1.0);
}



