#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


const float PI = 3.14159265358979323846264;
const float SQRT_2 = 1.4142135623730951;


float line_distance(vec2 p, vec2 p1, vec2 p2) {
    vec2 center = (p1 + p2) * 0.5;
    float len = length(p2 - p1);
    vec2 dir = (p2 - p1) / len;
    vec2 rel_p = p - center;

    return dot(rel_p, vec2(dir.y, -dir.x));
}

float segment_distance(vec2 p, vec2 p1, vec2 p2) {
    vec2 center = (p1 + p2) * 0.5;
    float len = length(p2 - p1);
    vec2 dir = (p2 - p1) / len;
    vec2 rel_p = p - center;
    float dist1 = abs(dot(rel_p, vec2(dir.y, -dir.x)));
    float dist2 = abs(dot(rel_p, dir)) - 0.5*len;

    return max(dist1, dist2);
}
float arrow_triangle(vec2 texcoord, float body, float head, float height,float linewidth, float antialias)
{
    float w = linewidth/2.0 + antialias;
    vec2 start = -vec2(body/2.0, 0.0);
    vec2 end = +vec2(body/2.0, 0.0);

    // Head : 3 lines
    float d1 = line_distance(texcoord, end, end - head*vec2(+1.0,-height));
    float d2 = line_distance(texcoord, end - head*vec2(+1.0,+height), end);
    float d3 = texcoord.x - end.x + head;
    
    // Body : 1 segment
    float d4 = segment_distance(texcoord, start, end - vec2(linewidth,0.0));
    float d = min(max(max(d1, d2), -d3), d4);

    return d;
}




float marker_ring(vec2 P, float size)
{
    float r1 = length(P) - size/2.;
    float r2 = length(P) - size/4.;
    return max(r1,-r2);
}


vec4 filled(float distance, float linewidth, float antialias, vec4 fill)
{
    vec4 frag_color;
    float t = linewidth/2.0 - antialias;
    float signed_distance = distance;
    float border_distance = abs(signed_distance) - t;
    float alpha = border_distance/antialias;
    alpha = exp(-alpha*alpha);

    // Within linestroke
    if( border_distance < 0.0 )
        frag_color = fill;
    // Within shape
    else if( signed_distance < 0.0 )
        frag_color = fill;
    else
        // Outside shape
        if( border_distance > (linewidth/2.0 + antialias) )
            discard;
        else // Line stroke exterior border
            frag_color = vec4(fill.rgb*alpha, 1.0);

    return frag_color;
}

void main() { 
	vec2 uv = gl_FragCoord.xy/resolution.y;
	const float linewidth = 0.01;
	const float antialias =  0.001;

	uv -= 0.5;
    
	float d1 = arrow_triangle(uv+vec2(0.2+0.4*cos(time)*cos(time),0), 1.0, 0.05, 0.5, linewidth, antialias);
	float d2 = marker_ring(uv, 0.3);
	
	float d = min(d1, d2);

	gl_FragColor = filled(d, linewidth, antialias, vec4(1.0));
}
