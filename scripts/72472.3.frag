#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float PI = radians(180.); // So many people hardcode PI by typing out its digits. Why not use this instead?

void main() {
	  vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv.y=1.0-uv.y;
    
    vec2 st = -1.0 + 2.0 * uv; 

	
	
	vec2 p = gl_FragCoord.xy / vec2(max(resolution.x, resolution.y)) ;
	float t = time*0.125 ;
	
	st*=0.5+sin(t*0.125)*0.25;

	float l = 0.0;
	for (float i = 1.0; i < 16.0; i++) {
		
		st.x += 0.1 / i * cos(i * 3.0 * st.y + t + sin(t ));
		st.y += 0.5 / i * sin(i * 3.0 * st.x + t + cos(t));
		
		l = length(vec2(0, p.y + sin(st.x * PI * i * ((sin(t) + cos(t))  *0.1+01.))));
	}

	//float g = 1.0 - pow(l, 0.5);
        //a.x 0->-5 makes black red
	//a.y -23->-2 makes torcoise thicker
	//vec3 a = vec3(-0.0, -16.0, 150.0);
	//vec3 b = vec3(0.0, -80.0, 0.0);
	//vec3 c = vec3(0.0, -400.0, -800.0);
	float pp=0.5-l;
	vec4 dd=vec4(pp/l,pp*l*12.,pp+l*1.,pp);

	// factor behind g-> higher makes color line thicker 
	//vec3 color = mix(a, mix(b, c, g / 2.0), g * 10.0);
	gl_FragColor = dd;
}