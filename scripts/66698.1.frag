#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rotateUV(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}


float stepp(vec2 c1, vec2 c2, vec2 uv){
	//vec2 c1 = vec2(.475,.2)/10.;
	//vec2((.525+j,.8+j)/10.)
	vec2 p = step(c1, uv)-step(c2, uv);
	return 1. - (p.x*p.y);
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	vec2 st = uv;
    
	vec3 color = vec3(1.);
	
	st = vec2(random(uv.xy*time/100000.));
    
	float j = 0.;
	for (int i = 0; i < 10; i++) {
		float z = 0.;
		for (int k = 0; k < 10; k++) {
			vec2 pct = step(vec2(.475+j,.2+z)/10., uv)-step(vec2(.525+j,.8+z)/10., uv);
			color *= 1. - pct.x*pct.y;
            vec2 pct2 = step(vec2(.2+j,.475+z)/10., uv)-step(vec2(.8+j,.525+z)/10., uv);
			color *= 1. - pct2.x*pct2.y;
			z++;
		}
		j++;
	}
    
    st *= 10.;
    st = floor(st);
    vec3 color1 = vec3(random(st));
    gl_FragColor = vec4(color*color1, 1.);
}