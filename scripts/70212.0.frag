#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 center = vec2(0,0);
vec3 col1 = vec3(1.2,0.1,.2);
vec3 col2 = vec3(1.1,0.4,.2);
vec3 col3 = vec3(1.12,10.12,.12);

//vec2 center = vec2(0,0);
//vec3 col1 = vec3(0.12,0.1,.2);
//vec3 col2 = vec3(0.12,0.19,.9);
//vec3 col3 = vec3(0.12,0.2,.12);

uniform vec2      speed;

float radius = 1.5;
float pos = 2.0 ;

float rand(vec2 n) {

  	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) {

	  const vec2 d = vec2(0.0, 1.0);
	  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	  return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) {

	  float total = 0.0, amplitude = 1.0;
	  for (int i = 0; i < 4; i++) {
 	   total += noise(n) * amplitude;
	    n += n;
	    amplitude *= 0.5;
	  }
	  return total;
}


void main( void ) {
	
    vec2 p = gl_FragCoord.xy * 8.0 / resolution.xx;

    float q = fbm(p - time * 1.1);
    vec2 r = vec2(fbm(p + q + time * speed.x - p.x - p.y), fbm(p + q - time * speed.y));
    pos-=1.0*sin(time+1.2*q);
    
    if (pos==.0){
		pos = 2.0;
	}
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv =  (-resolution.xy + pos*gl_FragCoord.xy)/resolution.y;
    //This is the supposed to be Input
    float timer = 0.3 + 1.1*abs(sin(time));

    float factor = pow(length(uv - center) / timer * radius, 3.0*timer);
    
    vec3 col = vec3(0.0);
    if(factor <= 1.0)
    {
	col = mix(col1, col2, factor);
    }
    else
    {
	col = mix(col2, col3, 0.5*(factor - 1.0));
    }

    // Output to screen
    gl_FragColor = vec4(col,1.0);

}