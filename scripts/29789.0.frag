precision highp float;

/*

http://twitter.com/rianflo

*/


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;

const float PI = 3.14159265358979323846;


float lengthMaxNorm(vec2 p)
{
    return max(abs(p.x), abs(p.y));
}

float distanceMaxNorm(vec2 a, vec2 b)
{
    return lengthMaxNorm(b-a);
}

float sdmSquare(vec2 p, vec2 c, float r, mat2 rot)
{
    float sd = lengthMaxNorm(rot*(p-c))-r;
    return sd * sqrt(2.0);
}

void main() 
{
    vec2 p = (-resolution.xy + 2.0 * gl_FragCoord.xy) / resolution.y;
    vec2 m = (mouse * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    float a = PI*sin(time)*0.1;;
    mat2 rot = mat2(
        cos(a), sin(a),
        -sin(a), cos(a)
    );
	
    float d = sdmSquare(p, vec2(0.5), 0.5, rot);
	float dm= sdmSquare(m, vec2(0.5), 0.5, rot); 
    gl_FragColor = vec4(mod(d, 1.0)*1.0, -d, 1.0-smoothstep(0.0, 0.005, abs(d)), 0.0);
	gl_FragColor += vec4(1.0-smoothstep(0.0, 0.005, abs(distanceMaxNorm(p, m)-abs(dm))));
}