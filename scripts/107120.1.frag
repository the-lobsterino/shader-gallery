#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D bb;

//twist

//Code by: fb39ca4. On Shadertoy
//https://www.shadertoy.com/view/XsXXDH

//Inspired by Matthew DiVito's gifs
//http://cargocollective.com/matthewdivito/Animated-Gifs-02


//Now I challange you to fork this shader with filter gradient and blur.
//http://payload71.cargocollective.com/1/3/111325/3721505/twist.gif

// 	Is it good now ? (Sorry I didn't do things very cleanly )
//							(kloumpt)



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
    x = clamp((x - edge0)/(edge1 - edge0), 0.0, 8.) * 3.14159265;
    return 0.5 - (cos(x) * 0.5);
}
vec3 getColorFromTime( float time)
{

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv = uv * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	uv *= 1.5;
	
    	float blurAmount = -0.005 * 1000.0 / resolution.y;
    
	float btime = mod(time, 1.0);
	btime = smootheststep(0.0, 1.0,  btime);
	
	vec3 returnVal = vec3(.0);
	
	gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	for (int i = 0; i < 9; i++) {
		float n = float(i);
		float size = 1.0 - n / 9.0;
		float rotateAmount = (n * 0.5 + 0.25) * PI * 2.; 
		returnVal = mix(returnVal, vec3(1.0), smoothstep(0.0, blurAmount, square(rotate(uv, -rotateAmount * btime), size)));
		float blackOffset = mix(1.0 / 4.0, 1.0 / 2.0, n / 9.0) / 9.0;
		returnVal = mix(returnVal, vec3(0.0), smoothstep(0.0, blurAmount, square(rotate(uv, -(rotateAmount + PI / 2.0) * btime), size - blackOffset)));
    }
return returnVal;
}

void main( void ) {
	float period = 3.0;
	float btime = time / period;

	vec3 mainVal 	= getColorFromTime(btime);
	vec3 SecondVal 	= getColorFromTime(btime -.00125);
	vec3 ThirdVal 	= getColorFromTime(btime -.0025);
	vec3 FirstMixInter = mix( SecondVal, ThirdVal, .25);
	vec3 SecondMixInter =  mix( SecondVal, ThirdVal, .30);
	
	vec3 FirstMix = mix ( mainVal, FirstMixInter, .25 );
	vec3 SecondMix = mix ( mainVal, SecondMixInter, .30 );
	
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	
	gl_FragColor.rgb = SecondMixInter;
	gl_FragColor = vec4( gl_FragColor.r, mix (mainVal, mix( SecondVal, ThirdVal, .25), .30 ).x, gl_FragColor.b, 1.);
	vec4 blurColor = texture2D(bb, uv); 
	blurColor.g = 0.; 
	blurColor.b = 0.; 
	gl_FragColor = mix(gl_FragColor, blurColor, (1.-max(gl_FragColor.r, max(gl_FragColor.g, gl_FragColor.b)))*distance(uv, vec2(.5))*1.5);
	gl_FragColor.gb*=.5+.5*distance(uv, vec2(0.3, 0.9));
	gl_FragColor.r*=.5+.5*distance(uv, vec2(0.6, 0.1));
}