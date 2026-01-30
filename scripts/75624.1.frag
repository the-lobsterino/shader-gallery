#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

mat2 rot(float a) {

    float s=sin(a) , c=cos(a);
    
    return mat2(c, -s, s, c);
}    

float star(vec2 uv, float flare) {
	mat2 r = rot(time);
	uv *= r;
	
	float d = length (uv);
	
	float m = .005 / d;
	
	float rays = max (0. , 1. -abs (uv.x * uv.y * 1000.));
	m +=rays * flare;
	uv *=rot(3.1415/4.);
    	rays = max (0. , 1. -abs (uv.x * uv.y * 1000.));
	m +=rays*.3 * flare;
    	m *= smoothstep(1.,.2,d);
    return m;
  
} 

void main( void ) {
	vec2 r2 = vec2(resolution.x);
	vec2 p = (gl_FragCoord.xy / r2.xy);
	
	vec3 destColor = vec3(sin(p.x), sin(p.y), sin(time));
	vec3 color = vec3(0.0);
	
	p.x -= 0.5;
	p.y -= 0.25;

	float v = floor(mouse.y*50.0);
	
	for (float i = 0.0; i < 100.0; i++) {
		if (i >= v) break;
		vec2 p2 = p;
		
		p2 = scale( vec2(sin(time)-2.0)) * p2;
			
		float a = i*(4.0*PI)/v;
		
		p2.x += cos((time+a) / 2.0) / 4.0;
		p2.y += sin((time+a) / 2.0) / 4.0;
		color += vec3(star(p2, mouse.x));
	
	}

	gl_FragColor = vec4(color * destColor, 1.0 );

}