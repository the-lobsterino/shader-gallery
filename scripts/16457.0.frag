#ifdef GL_ES
precision mediump float;
#endif

#define M_PI 3.1415926535897932384626433832795

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

float PI = atan(1.0)*4.0;

float rand(vec2 co){
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt= dot(co.xy ,vec2(a,b));
    float sn= mod(dt,3.14);
    float val1 = (sin((sn * c)));
    return val1;
}

vec3 color(float d) {
	return d * vec3(0.1, 1, 0.1);	
}

void main(void)
{
	
	//mat4 ufoset = mat4(rand(gl_FragCoord.xy), rand(gl_FragCoord.xy), rand(gl_FragCoord.xy),rand(gl_FragCoord.xy), rand(gl_FragCoord.xy), rand(gl_FragCoord.xy), rand(gl_FragCoord.xy), rand(gl_FragCoord.xy),rand(gl_FragCoord.xy),rand(gl_FragCoord.xy),rand(gl_FragCoord.xy),rand(gl_FragCoord.xy),rand(gl_FragCoord.xy),rand(gl_FragCoord.xy),rand(gl_FragCoord.xy),rand(gl_FragCoord.xy));
	vec2 pos = (gl_FragCoord.xy / resolution.xy) + mouse;
	
	pos -= vec2(1.,1.);
	float r = length(pos);
	float fi = atan(pos.y, pos.x) + sin(r*100.0)*0.1;
	
	vec3 col = vec3(1, 1. - sin(fi * 20. + 5. * time), 1. - sin(-5. * r + 3. * time));//color(pow(fract(a/PI / -2.0), 20.0) + ufos) * (1.0 - smoothstep(0.98, 1.0, r));
	if (r < .015) col.y = 0.;
	gl_FragColor = vec4(col, 1.0);
}