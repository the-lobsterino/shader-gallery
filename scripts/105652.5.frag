#extension GL_OES_standard_derivatives : enable

precision highp float;

#define MAX_ITER 100
#define MIN_LENGTH 0.1

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float SmoothMin(float d1, float d2, float k)
{
    float h = exp(-k * d1) + exp(-k * d2);
    return -log(h) / k;
}


float Sphere(vec3 pos, float radius)
{
    return length(pos) - radius;
}


float RoundBox(vec3 pos, vec3 size, float round)
{
    vec3 d = abs(pos) - size;
    return length(max(abs(pos) - size, 0.0)) - round
        + min(max(d.x, max(d.y, d.z)), 0.0);
}

vec3 Rotate(vec3 p, float angle, vec3 axis)
{
    vec3 a = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float r = 1.0 - c;
    mat3 m = mat3(
        a.x * a.x * r + c,
        a.y * a.x * r + a.z * s,
        a.z * a.x * r - a.y * s,
        a.x * a.y * r - a.z * s,
        a.y * a.y * r + c,
        a.z * a.y * r + a.x * s,
        a.x * a.z * r + a.y * s,
        a.y * a.z * r - a.x * s,
        a.z * a.z * r + c
    );
    return m * p;
}

float distanceFunc(vec3 ray) {
	float circle1 = Sphere(vec3(300, 200. + (sin(time) * 80.), -20) - ray, 40.);
	float circle2 = RoundBox(Rotate(vec3(300, 200. + (sin(time) * 190.), -20) - ray, 0., vec3(0,1,0)), vec3(20), 2.);
	return SmoothMin(circle1/5., circle2/5., 0.5);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy/* / resolution.xy*/ );
	vec3 ray = vec3(position, 0);
	vec3 dir = vec3(0,0,1);	
	vec3 color = vec3(0);
	
	for (int i = 0; i < MAX_ITER; ++ i)
	{
		float dis = distanceFunc(ray);
		ray += dir * dis;
		
		if (dis <= MIN_LENGTH)
		{
			float epsilon = 0.01; // arbitrary — should be smaller than any surface detail in your distance function, but not so small as to get lost in float precision
			float centerDistance = distanceFunc(ray);
			float xDistance = distanceFunc(ray + vec3(epsilon, 0, 0));
			float yDistance = distanceFunc(ray + vec3(0, epsilon, 0));
			float zDistance = distanceFunc(ray + vec3(0, 0, epsilon));
			vec3 normal = (vec3(xDistance, yDistance, zDistance) - centerDistance) / epsilon;
			
			color = vec3(1) * (distance(normal, vec3(0, 0.5, 0)) * 0.3);
			break;
		}
	}

	gl_FragColor = vec4(color, 1);

}