#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//twist

//Code by: fb39ca4. On Shadertoy
//https://www.shadertoy.com/view/XsXXDH

//Inspired by Matthew DiVito's gifs
//http://cargocollective.com/matthewdivito/Animated-Gifs-02


//Now I challange you to fork this shader with filter gradient and blur.
//http://payload71.cargocollective.com/1/3/111325/3721505/twist.gif

const float PI = 3.14159265;

vec2 rotate(vec2 v, float a) {
	float sinA = sin(a);
	float cosA = cos(a);
	return vec2(v.x * cosA - v.y * sinA, v.y * cosA + v.x * sinA); 	
}

float square(vec2 uv, float d) {
	return max(abs(1.4*sin(uv.x)), abs(1.2*sin(uv.y))) - d;	
}

float smootheststep(float edge0, float edge1, float x)
{
    x = clamp((x - edge0)/(edge1 - edge0), 0.0, 1.0) * 3.14159265;
    return 0.5 - (cos(x) * 0.5);
}


void main( void ) {
	
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv = uv * 9.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	//uv *= 1.5;
	
    	float blurAmount = -0.001 * 10000.0 / resolution.y;
    
	float period = 5.0;
	float btime = time / period;
	btime = mod(btime, 2.0);
	btime = smootheststep(0.0, 1.0, btime);
	
	gl_FragColor = vec4(55.0, 0.6, 0.95, 45.0);
	for (int i = 0; i < 18; i++) {
		float n = float(i);
		float size = 1.0 - n / 9.0;
		float rotateAmount = (n * 0.5 + 0.25) * PI * 2.0; 
		gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(4.3,1.3,1.3), smoothstep(0.0, blurAmount, square(rotate(uv, rotateAmount * btime), size)));
		float blackOffset = mix(1.0 / 4.0, 1.0 / 12.0, n / 9.0) / 9.0;
		gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(2.0,0.0,0.0), smoothstep(0.0, blurAmount, square(rotate(uv, -(rotateAmount + PI / 2.0) * btime), size - blackOffset)));
    }
}