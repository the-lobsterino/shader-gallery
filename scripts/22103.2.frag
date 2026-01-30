#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

const vec2 P1 = vec2( 0.0,  0.5);
const vec2 P2 = vec2( 0.5, -0.5);
const vec2 P3 = vec2(-0.5, -0.5);

vec2 p;

float line(vec2 p1, vec2 p2, float w)
{
	float t = length(p - p1) / length(p2 - p1);
	if (t < 0.0 || t > 1.0) return 0.0;
	float aa = 0.5 * w;
	vec2 d = mix(p1, p2, t);
	return 1.0 - smoothstep(aa, w, length(d - p));
}

float triangle(vec2 p1, vec2 p2, vec2 p3, float w)
{
	return clamp(line(p1, p2, w) + line(p2, p3, w) + line(p1, p3, w), 0.0, 1.0);
}

float islope(vec2 p1, vec2 p2)
{
	float dx = (p2.x - p1.x);
	float dy = (p2.y - p1.y);
	return (dx / dy);
}

vec2 circumcenter(vec2 p1, vec2 p2, vec2 p3)
{
        vec2 c;

        if (p1.y == p2.y)
        {
                vec2 p13 = (p1 + p3) * 0.5;
                vec2 p23 = (p2 + p3) * 0.5;

                float s13 = -islope(p1, p3);
                float s23 = -islope(p2, p3);

                c.x = (s13 * p13.x + p23.y - p13.y - s23 * p23.x) / (s13 - s23);
                c.y = s13 * (c.x - p13.x) + p13.y;
        }

        else if (p1.y == p3.y)
        {
                vec2 p12 = (p1 + p2) * 0.5;
                vec2 p23 = (p2 + p3) * 0.5;

                float s12 = -islope(p1, p2);
                float s23 = -islope(p2, p3);

                c.x = (s12 * p12.x + p23.y - p12.y - s23 * p23.x) / (s12 - s23);
                c.y = s12 * (c.x - p12.x) + p12.y;
        }

        else // if (p2.y == p3.y) or trivial case
        {
                vec2 p12 = (p1 + p2) * 0.5;
                vec2 p13 = (p1 + p3) * 0.5;

                float s12 = -islope(p1, p2);
                float s13 = -islope(p1, p3);

                c.x = (s12 * p12.x + p13.y - p12.y - s13 * p13.x) / (s12 - s13);
                c.y = s12 * (c.x - p12.x) + p12.y;
        }

        return c;
}

mat2 rotZ(float theta)
{
	return mat2(cos(theta), sin(theta), -sin(theta), cos(theta));
}

void main()
{
	float a = resolution.x / resolution.y;
	p = ((gl_FragCoord.xy / resolution.xy) - 0.5) * 2.0;
	p.x = p.x * a;
	
	mat2 M = rotZ(time * 2.5) + 0.5 * (sin(time * 4.0) + 1.0);
	
	float t  = triangle(P1 * M, P2 * M, P3, 0.005);
	vec2 cc  = circumcenter(P1 * M, P2 * M, P3);
	
	float k = length(p - cc);
	
	float r  = length(P1 * M - cc);
	float dc = 1.0 - step(float(k < (r + 0.01) && k > (r - 0.01)), 0.0);
	
	float cr = step(float(length(p - cc) > 0.015), 0.0);

	gl_FragColor = vec4(t, dc, cr, 0.0);

}