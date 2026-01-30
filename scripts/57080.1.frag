#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define RADR(n) ((n) * 180 / 3.14159265358979)

float CustomCos(float _angle,float _distance)
{
	float ret = cos(_angle * 180.0 / 3.14159265358979) * _distance;
	return ret;
}
float CustomSin(float _angle,float _distance)
{
	float ret = sin(_angle * 180.0 / 3.14159265358979) * _distance;
	return ret;
}


float distanceFunction(vec3 pos) {
    float d = length(pos) - 0.5;
    return d;
}
float c = 0.0;
float screenZ = 0.0;
void main( void ) {
    vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy ) / min(resolution.x, resolution.y);

    vec3 cameraPos = vec3(0., 0., -5.);
        screenZ = 2.5;
	c = 0.0;
	
	c = c + 1.;
	
	if(c > 360.0){c = 0.0;}
	screenZ = CustomCos(c,10.5);
	
	
    vec3 rayDirection = normalize(vec3(p, screenZ));

    float depth = 0.0;

		
    vec3 col = vec3(0.0);

    for (int i = 0; i < 99; i++) {
        vec3 rayPos = cameraPos + rayDirection * depth;
        float dist = distanceFunction(rayPos);

        if (dist < 0.0001) {
            col = vec3(1.);
            break;
        }

        depth += dist;
    }

    gl_FragColor = vec4(col, 1.0);
}