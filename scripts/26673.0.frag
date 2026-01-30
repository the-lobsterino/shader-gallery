#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D backbuffer;


const float PI = 3.14159265;

vec2 rotate(vec2 v, float a) {
	float sinA = sin(a);
	float cosA = cos(a);
	return vec2(v.x * cosA - v.y * sinA, v.y * cosA + v.x * sinA); 	
}

float square(vec2 uv, float d) {
	return max(abs(uv.x), abs(uv.y)) - d;	
}

float smootheststep(float edge0, float edge1, float x)
{
    x = clamp((x - edge0)/(edge1 - edge0), 0.0, 1.0) * 3.14159265;
    return 0.5 - (cos(x) * 0.5);
}
vec3 getColorFromTime( float time)
{

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv = uv * 2.5 - 1.0;
	uv.x *= resolution.x / resolution.y;
	uv *= 1.125;
	uv /= 1.667;
    	float blurAmount = -0.067 * 200.0 / resolution.x;
    
	float btime = mod(time, 1.0);
	btime = smootheststep(0.1, 1.111,  btime);
	
	vec3 returnVal = vec3(.0);
	
	gl_FragColor = vec4(0.0, 0.0, 0.5, 1.0);
	for (int i = 0; i < 22; i++) {
		float n = float(i);
		float size = 1.111 - n / 13.0;
		float rotateAmount = (n * 0.5 + 0.125) * PI * 0.5; 
		returnVal = mix(returnVal, vec3(1.0), smoothstep(0.0, blurAmount, square(rotate(uv, -rotateAmount * btime), size)));
		float blackOffset = mix(1.0 / 4.0, 1.0 / 2.0, n / 9.0) / 9.0;
		returnVal = mix(returnVal, vec3(0.0), smoothstep(0.0, blurAmount, square(rotate(uv, -(rotateAmount + PI / 2.0) * btime), size - blackOffset)));
    }
return returnVal;
}

void main( void ) {
	float period = 3.333;
	float btime = dot(-cos(log2(time)),sqrt(time)) / period;
		btime -= pow(sin(time),inversesqrt(time)) / cos(time/period);
	vec3 mainVal 	= getColorFromTime(mod((btime*0.01),sqrt(time/btime)));
	vec3 SecondVal 	= getColorFromTime(btime -.125);
	vec3 ThirdVal 	= getColorFromTime(-btime +.025);
	vec3 FirstMixInter = mix( SecondVal, ThirdVal, .125);
	vec3 SecondMixInter =  mix( SecondVal, ThirdVal, .333);
	
	vec3 FirstMix = mix ( mainVal, FirstMixInter, .125 );
	vec3 SecondMix = refract ( mainVal, SecondMixInter, .333 );
	
	vec2 uv = gl_FragCoord.xy/vec2(resolution.x*1.667,resolution.y*0.5);
	     uv += gl_FragCoord.xx/(resolution.xx*1.95);
	     uv -= gl_FragCoord.yy/(resolution.yy*1.125);
	gl_FragColor.rgb = SecondMixInter;
	gl_FragColor = vec4( gl_FragColor.r, mix (mainVal, mix( SecondVal, ThirdVal, .25), .30 ).x, gl_FragColor.b, 1.);
	vec4 blurColor = texture2D(backbuffer, uv); 
	blurColor.r = 0.075; 
	blurColor.g = 0.067; 
	gl_FragColor = mix(gl_FragColor, blurColor, (1.-max(gl_FragColor.r, max(gl_FragColor.g, gl_FragColor.b)))*distance(uv, vec2(.5))*1.5);
	gl_FragColor.bg*=.125+.5*distance(uv, vec2(0.3, 0.5));
	gl_FragColor.r*=.5+.67*distance(uv, vec2(0.3, 0.125));
	gl_FragColor.b*=.67+.5*distance(uv, vec2(0.2, 0.677));
}