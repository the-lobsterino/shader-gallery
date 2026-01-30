#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define ZOOM   2.0
#define time   time*4.0

#define zoom   ZOOM
#define uv     p
#define uv0     p0
#define yellow vec4(1, 1, 0, 1)


float circleAlpha(in vec2 pos, in float bordersmooth)
{
    const vec2 c = vec2(0.0, 0.0);
    vec2 p =  5.* (pos - c); 
    float r = (p.x * p.x) + (p.y * p.y); 
    return 1.0 - step(bordersmooth, r);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p = (1./zoom)*(2.0*gl_FragCoord.xy - resolution) / min( resolution.x, resolution.y );
	 vec2 p0 = (1./zoom)*(1.8*gl_FragCoord.xy - resolution) / min( resolution.x, resolution.y );
 
    float bordersmooth = mix(0.95, 1.0, abs(sin(time)));
    float bordersmooth2 = mix(0.01, 0.02, abs(sin(time)));
	
    float alpha = circleAlpha(p, bordersmooth);
	 float alpha0 = circleAlpha(p0, bordersmooth2);
	

    vec3 col = 0.5 + cos(time+uv.xyx+vec3(0.,5.,9.));
	vec3 col0 = 6.5 + cos(time+uv0.xyx+vec3(0.,5.,9.));
	col = mix(col, col0, alpha0);

    // Output to screen
    fragColor = vec4(col * alpha, alpha);
}




void main ()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}