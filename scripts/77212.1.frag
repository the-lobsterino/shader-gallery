#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D backbuffer;


#define PI 3.14159265359
#define TWO_PI 6.28318530718


vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

vec4 texture_at(sampler2D t, float x, float y) {
    vec2 uv = vec2(x, y) / resolution.xy;
    
    vec2 coord = (2.0 * floor(uv) + 0.5);
    return texture2D(t, coord);
}

void main(void) {
	vec2 p = gl_FragCoord.xy / resolution.xy;
	vec2 pixel = 1.0 / resolution;
	vec4 old = texture2D(backbuffer, p);
	vec4 color = texture_at(backbuffer, p.x, p.y);
	
	vec2 toCenter = vec2(0.5)-p;
	float angle = atan(toCenter.y,toCenter.x);
	float radius = length(toCenter)*2.0;
	color = vec4(hsb2rgb(vec3((angle/TWO_PI)+0.5,radius,1.0)), 1.0) / 2.0;
	
	p.x -= mouse.x;
	p.y -= mouse.y;

	//Brush size (reversed)
	p *= 50.0;
	
	//Brush Shape
	int N = 10;
	float a = atan(p.x,p.y)+PI;
  	float r = TWO_PI/float(N);
	
	float d = cos(floor(.5+a/r)*r-a)*length(p);

  	color *= vec4(vec3(1.0-smoothstep(.4,.41,d)), 1.0);
	
		gl_FragColor = vec4(color + old);
	
	if (time < 0.1) {
		gl_FragColor = vec4(color);
	}

}