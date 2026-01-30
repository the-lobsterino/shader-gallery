#ifdef GL_ES
precision highp float;
#endif

/*
	VAI BRASIL RUMO AO HEXA!!!
  	GO BRAZIL
*/

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float space = 0.45;

float st(float s) { 
	return smoothstep(0.99,1.0,s); 
}
float hash( float n ){
    return fract(sin(n)*43758.5453123);
}

float noise( in vec2 x ){
    vec2 p = floor(x);
    vec2 f = fract(x);

    f = f*f*(3.0-2.0*f);

    float n = p.x + p.y*57.0;

    float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                    mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);

    return res;
}

const mat2 m2 = mat2(0.8, 0.6, -0.6, 0.8);
	
float fbm( vec2 p )
{
    float f = 0.0;

    f += 0.5000*noise( p ); p = m2*p*2.02;
    f += 0.2500*noise( p ); p = m2*p*2.03;
    f += 0.1250*noise( p ); p = m2*p*2.01;
    f += 0.0625*noise( p );

    return f/0.9375;
}

bool define(vec2 p, out float x){
	float a = p.y - p.x - space;
	float b = -p.y + space - p.x;
	float c = p.y + space  + p.x;
	float d = p.y + space  - p.x;
	x = a*b*c*d;
	if(a < 0. && b > 0.  && c > 0. && d > 0. ) return true;
	return false;
}



void main( void ) {
	vec2 p = gl_FragCoord.xy/resolution;		
	vec2 position = -1. + 2.*p;
	
	
	float x = position.x*2.+3.*time*1.5;
	position.y *= 1.+ sin(x)*0.05;

	
	vec2 aux = position;
	vec2 q = position;
	position.x *= resolution.x/resolution.y;
		
	
	float a = sqrt(dot(position,position));
	float s = atan(position.x, position.y);
	vec3 col = vec3(0.);
	vec4 finalColor = vec4(0.);

	
	// quadradinho	
	if(q.x < 0.57 && q.x > -0.57 && q.y > -0.9 && q.y < 0.9){
		float t = a;		
		float f = 1. - smoothstep(0.4, 0.8, q.x);
		col = mix(col, vec3(0.3,0.8,0.4), f);
		
		f = fbm(7.*q.xy);
		col = mix(col, vec3(0.2,0.67,0.2), f);
		
		
		
		t += .05*fbm(7.*q);
		f = smoothstep(0.4, 0.6, t);
		col *= 1.4-t;
		
		t += .05*fbm(q.yx);
		f = smoothstep(0.4, 0.6, t);
		
		col *= 1.5-t;
		f = smoothstep(0., 0.7, length(position - vec2(0.2, 0.17)));
		col += vec3(0.2,0.6,0.)*f*0.3;
			

		finalColor = vec4(col,1.)*vec4(1.5);
		
	}
	
		
	//dat losango
	if(aux.x < space && aux.x > -space && aux.y > -space && aux.y < space ){
		float x;
		if(define(aux,x)){
			col = vec3(1.,1.,0.);
			
			float f = smoothstep(0., 0.9,aux.x);
			col *= 1.-f;
			f = fbm(vec2(1.*a, 10.*s));
			col = mix(col, vec3(0.4,0.4, 0.), f);			
			
			f = smoothstep(0., 0.7, length(position - vec2(0.2, 0.17)));
			col += vec3(0.7,0.6,0.)*f*0.3;
			
			finalColor = vec4(col,1.)*vec4(1.4);				
		}
	}
	
	//circulo
	a += .005*fbm(15.*p);
	if(a < 0.35){
		col = vec3(0.);
		float f = 1.- smoothstep(0.2, 0.5, a);
		col = mix(col, vec3(0.4,0.4,0.9), f);
		f = smoothstep(0.2,0.4,a);
		col *= 1.2-f;
		
		f = 1.-smoothstep(0.2, 0.6, fbm(vec2(1.*a, a)));
		col *= f;
		f = smoothstep(0., 0.3, length(position - vec2(0.2, 0.17)));
		col += vec3(0.2,0.2,0.6)*f*0.2;

		col = mix(col,vec3(0.50),st(1.0-abs(position.y-0.15+pow(position.x/1.5+0.15,2.0))+0.04)*(1.0-st(length(position)+0.5)));
		finalColor = vec4(col,1.)*vec4(2.);		
	}
	gl_FragColor = finalColor;	
	
}