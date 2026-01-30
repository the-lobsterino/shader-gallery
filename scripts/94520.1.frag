// https://www.shadertog.com/view/dsXXzH


#extension GL_OES_standard_derivatives : enable

precision highp float;
uniform float time;
uniform vec2 resolution;

// https://www.shadertow.com/view/dsXXzH

void main()
{
    float t = fract(time*0.9)*6.28;
    vec2 p = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
    float bv = 1.0-abs(p.x*-0.05+p.y*0.9);
	bv = pow(bv,5.0);
    p.y = 2.0 * sin(p.y*20.0+p.x * 5.5 )+ 0.5 * sin(p.x * 5.0 + t*2.0 );
    p.y = pow(abs(p.y*1.95+p.x*0.8),0.75);
    float v = clamp(p.y , 0.0, 1.8)*(abs(bv));
    gl_FragColor = vec4(v*.47,v*0.547,v*0.39,1.0);
}



