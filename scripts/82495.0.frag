#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define ZOOM   1.0

#define zoom   ZOOM
#define uv     p


float circleAlpha(in vec2 pos)
{
    const vec2 c = vec2(0.0, 0.0);
    vec2 p = 2.0 * (pos - c); // changing coords to center
    float r = (p.x * p.x) + (p.y * p.y); // omitting sqrt beacause comparison below is made against 1
    return r;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // just centered
    vec2 p = (1./zoom)*(2.0*gl_FragCoord.xy - resolution) / min( resolution.x, resolution.y );
    
    // Computing alpha in terms of uv coord
    float alpha = circleAlpha(uv);

    // Time varying pixel color
    vec3 col = 0.9 + 0.5*cos(time+uv.xyx+vec3(0,2,4));

    // Output to screen
    fragColor = vec4(col * alpha, alpha);
}

void main ()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}