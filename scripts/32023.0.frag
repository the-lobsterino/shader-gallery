#ifdef GL_ES //g
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float crossProduct (float ax, float ay, float bx, float by)
{
	float t = float (ax * by - bx * ay);
	return t;
}

vec2 randomVec2( vec2 p )
{
	mat2 m = mat2( 15.27, 47.63,
		       99.41, 88.98 );
	
	return fract( sin(m * p) * 46839.32 );
}

float rand(float co){
	return fract(sin(dot(vec2(co) ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {

	vec2 p = gl_FragCoord.xy;

	for(int i = 0 ; i < 2048; i++) {
		vec2 p = vec2(
			abs(cos(float(i) * 0.015 + time * 0.2)) * 1000.0,
			abs(sin(float(i) * 0.03 + time * 0.3)) * 1000.0);
		vec2 p0 = p;
		vec2 p1 = p - vec2(-7.0, 10.0);
		vec2 p2 = p - vec2( 7, 10.0);
		vec2 Max = max(p0, max(p1, p2));
		vec2 Min = min(p0, min(p1, p2));
		vec2 coord = gl_FragCoord.xy;
		if(Min.x < coord.x && Min.y < coord.y && Max.x > coord.x && Max.y > coord.y)
		{
			
	
			vec2 vs0 = p1 - p0;
			vec2 vs1 = p2 - p0;
			float qx = coord.x - p0.x;
			float qy = coord.y - p0.y;
			float s = crossProduct (qx, qy, vs1.x, vs1.y) / crossProduct (vs0.x, vs0.y, vs1.x, vs1.y);
			float t = crossProduct (vs0.x, vs0.y, qx, qy) / crossProduct (vs0.x, vs0.y, vs1.x, vs1.y);
			if ((s >= 0.0) && (t >= 0.0) && (s + t <= 1.0))
			{
				gl_FragColor = vec4(1.0, 1.0, 1.0, 0.02);
			}
	}
	}
	gl_FragColor *= vec4(gl_FragCoord.y / resolution.y + 0.2);
}