
// a simplified version of drawing lines and line segments
// coded by Twareintor (2017) mailto=ciutacu/0]g'mail*com

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359

#define OMEGA 1.25 		// 1.25


mat4 tra1 = mat4(
		1., 0., 0., 0.,
		0., 1., 0., 0.,
		0., 0., 0., 0.,
		0., 0., 1., 1.
		);

float point(vec3 p0, float size)
{
    vec4 newpos = gl_FragCoord*tra1;
    float q = clamp(1.-float(length(newpos.xyz-p0)/size), 0., 1.);
    return q;

}

float line(vec3 p0, vec3 p1, float size)
{
    vec4 newpos = gl_FragCoord*tra1;
    vec3 pos = p0+normalize(p1-p0)*length(newpos.xyz-p0)*dot(normalize(p1-p0), normalize(newpos.xyz-p0));
    float q = clamp(1.-float(length(newpos.xyz-pos)/size), 0., 1.); 
    return q;
}

float segment(vec3 p0, vec3 p1, float size, bool ends)
{
    vec4 newpos = gl_FragCoord*tra1;
    float q = line(p0, p1, size);
    // limit the line at its ends:
    q*=float(0.0>=dot(normalize(newpos.xyz-p0), normalize(newpos.xyz-p1)));
    if(ends) q = max(q, point(p0, size)); // adding points same size at ends
    if(ends) q = max(q, point(p1, size));
    return q;
}

void main()
{
    vec3 cen = vec3(resolution/2., 0.);
    vec4 outColor;
    vec3 outer[3];
    for(int i=0; i<3; i++)
    {
        float phase = PI*2./3.*float(i);	
        outer[i] = 240.*vec3(+cos(OMEGA*time+phase), -sin(OMEGA*time+phase), 0.);
    }
    float lr = segment(cen, cen+outer[0], 5.0, true);
    float lg = segment(cen, cen+outer[1], 5.0, true);
    float lb = segment(cen, cen+outer[2], 5.0, true);
    outColor = vec4(lr, lg, lb, 1.);
    gl_FragColor = outColor;

}


