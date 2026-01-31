#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sign (vec2 p1, vec2 p2, vec2 p3)
{
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

bool pointInTriangle(vec2 pt, vec2 v1, vec2 v2, vec2 v3)
{
    float d1, d2, d3;
    bool has_neg, has_pos;

    d1 = sign(pt, v1, v2);
    d2 = sign(pt, v2, v3);
    d3 = sign(pt, v3, v1);

    has_neg = (d1 < 0.0) || (d2 < 0.0) || (d3 < 0.0);
    has_pos = (d1 > 0.0) || (d2 > 0.0) || (d3 > 0.0);

    return !(has_neg && has_pos);
}

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution;
	
	vec4 color = vec4(1.0);
	
	if(uv.y < 0.333333) {
		color.rgb = vec3(0.0, 122.0, 61.0) / vec3(255.0);
	}
	if(uv.y > 0.666666) {
		color.rgb = vec3(0.0);		
	}
	if(pointInTriangle(uv, vec2(0.0), vec2(0.45, 0.5), vec2(0.0, 1.0)))
	{
		color.rgb = vec3(205.0, 16.0, 38.0) / vec3(255.0);
	}
	

	gl_FragColor = color;
}